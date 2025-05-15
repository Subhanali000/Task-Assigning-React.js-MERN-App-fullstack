
const Agent = require('../models/Agent');

exports.addAgent = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    const existing = await Agent.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Agent already exists' });
    }

    const newAgent = new Agent({ name, email, mobile, password });
    await newAgent.save();

    res.status(201).json({ message: 'Agent created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.find();
    res.json(agents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
