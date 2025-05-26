const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const List = require('../models/List');
const auth = require('../middleware/auth');

// Multer setup
const storage = multer.diskStorage({
  destination: './upload/',
  filename: (req, file, cb) => {
    cb(null, 'upload-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /\.(csv|xlsx)$/;  // Allow both .csv and .xlsx
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and XLSX files are allowed'));
    }
  },
});


// GET: All distributions (admin)
router.get('/all', auth, async (req, res) => {
  try {
    const lists = await List.find().populate('assignedTo', 'name');
    res.json(lists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET: Logged-in agent's tasks
router.get('/my-tasks', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'agent') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tasks = await List.find({ assignedTo: user._id })
      .select('name phone notes fileName createdAt')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET: Grouped distribution data
router.get('/distributions', auth, async (req, res) => {
  try {
    const lists = await List.find()
      .populate('assignedTo', 'name email mobile')
      .select('name phone notes fileName assignedTo');

    const grouped = {};

    lists.forEach((item) => {
      const file = item.fileName || 'Unknown File';
      const agent = item.assignedTo?.name || 'Unassigned';

      if (!grouped[file]) grouped[file] = {};
      if (!grouped[file][agent]) grouped[file][agent] = [];

      grouped[file][agent].push({
        name: item.name,
        notes: item.notes,
        email: item.assignedTo?.email || 'N/A',
        agentMobile: item.assignedTo?.mobile || 'N/A',
      });
    });

    res.json(grouped);
  } catch (err) {
    console.error('Error fetching distributions:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST: Upload CSV and assign tasks (5 per agent max)
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const noteFromForm = req.body.note || '';
    const agents = await User.find({ role: 'agent' });
    if (!agents.length) {
      return res.status(400).json({ message: 'No agents available.' });
    }

    const results = [];
    const agentTaskCount = {};

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          const savedLists = [];

          for (const item of results) {
            let assignedAgent = null;
            for (const agent of agents) {
              const count = agentTaskCount[agent._id] || 0;
              if (count < 5) {
                assignedAgent = agent;
                agentTaskCount[agent._id] = count + 1;
                break;
              }
            }

            if (!assignedAgent) continue;

            const newList = new List({
              name: item.name,
              phone: item.phone,
              notes: noteFromForm || item.notes || '',
              assignedTo: assignedAgent._id,
              fileName: req.file.filename,
            });

            savedLists.push(await newList.save());
          }

          fs.unlinkSync(req.file.path);
          res.json({ message: 'Uploaded and assigned successfully', data: savedLists });
        } catch (err) {
          console.error('DB save error:', err);
          res.status(500).json({ message: 'Database error' });
        }
      });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET: Logged-in agent info + their tasks
router.get('/agent-details', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email mobile createdAt role');
    if (!user || user.role !== 'agent') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tasks = await List.find({ assignedTo: user._id })
      .select('name phone notes fileName createdAt')
      .sort({ createdAt: -1 });

    res.json({
      agentInfo: {
        name: user.name,
        email: user.email,
        phone: user.mobile,
        joiningDate: user.createdAt,
      },
      tasks,
    });
  } catch (err) {
    console.error('Error fetching agent details:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;