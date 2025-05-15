const csv = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const List = require('../models/List');
const Agent = require('../models/Agent');
const path = require('path');

exports.uploadList = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const filePath = path.join(__dirname, '../uploads', req.file.filename);
  const ext = path.extname(req.file.originalname);

  let entries = [];

  try {
    if (ext === '.csv') {
      // CSV Parser
      const data = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          data.push(row);
        })
        .on('end', async () => {
          await distributeList(data, res);
        });
    } else if (ext === '.xlsx' || ext === '.xls') {
      // XLSX Parser
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(sheet);
      await distributeList(data, res);
    } else {
      return res.status(400).json({ message: 'Unsupported file format' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to process file' });
  }
};

const distributeList = async (data, res) => {
  try {
    const agents = await Agent.find();
    if (!agents.length) return res.status(400).json({ message: 'No agents available' });

    const entriesPerAgent = Math.floor(data.length / agents.length);
    let remaining = data.length % agents.length;

    let assignedIndex = 0;
    for (let i = 0; i < agents.length; i++) {
      const numEntries = entriesPerAgent + (remaining > 0 ? 1 : 0);
      remaining--;

      for (let j = 0; j < numEntries; j++) {
        const item = data[assignedIndex];
        await List.create({
          firstName: item.FirstName,
          phone: item.Phone,
          notes: item.Notes,
          assignedTo: agents[i]._id,
        });
        assignedIndex++;
      }
    }

    res.json({ message: 'List distributed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error distributing list' });
  }
};

exports.getAllLists = async (req, res) => {
  try {
    const lists = await List.find().populate('assignedTo', 'name email');
    res.json(lists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
