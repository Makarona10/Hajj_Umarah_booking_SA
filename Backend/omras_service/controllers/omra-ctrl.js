
const Omra = require('../models/omra-model')
/////////update
updateOmra  = async (req, res) => {
    const { id } = req.params;
    const { max_num_trav } = req.body;

    try {
        const updatedOmra = await Omra.findByIdAndUpdate(id, { max_num_trav }, { new: true });

        if (!updatedOmra) {
            return res.status(404).json({
                success: false,
                error: 'Omra not found',
            });
        }

        res.status(200).json({
            success: true,
            data: updatedHajj,
            message: 'Omra updated successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
// Function to create a new Omra
createOmra = async (req, res) => {
    const { omraname, password,from_where,to_where,ticket_price,day_and_time,max_num_trav } = req.body;

    try {
        const newOmra = new Omra({ omraname, password,from_where,to_where,ticket_price,day_and_time,max_num_trav });
        await newOmra.save();

        res.status(201).json({
            success: true,
            data: newOmra,
            message: 'Omra created successfully!',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// Function to delete a Omra
deleteOmra = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedOmra = await Omra.findByIdAndDelete(id);

        if (!deletedOmra) {
            return res.status(404).json({
                success: false,
                error: 'Omra not found',
            });
        }

        res.status(200).json({
            success: true,
            data: {},
            message: 'Omra deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// Function to get all Omras
getAllOmras = async (req, res) => {
    try {
        const omras = await Omra.find();

        res.status(200).json({
            success: true,
            data: omras,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

checkServiceRunning = (req, res) => {
    res.send('Hello World! - from omras service');
}

module.exports = {
    checkServiceRunning,
    createOmra,
    deleteOmra,
    getAllOmras,
    updateOmra
}