const File = require('./../models/File')
const csvToJson = require('csvtojson')

const uploadFile = async(req,res)=>{
    const file = req.file
    const fileName = req.file.originalname
    try{
        if(!file)return res.status(400).json({
            ok:false,
            msg:'hey file is mandatory'
        })
        const jsonArray = await csvToJson()
                                .fromString(file.buffer.toString('utf-8'))

        const dbFile = await File.findOne({name:fileName})
        if(dbFile) return res.status(400).json({
            ok:false,
            msg: `heyy file with name ${fileName} is already exist`
        })
        const dbfileToSave = new File ({
            name:fileName,
            data:jsonArray
        })
        await dbfileToSave.save()
        return res.status(201).json({
            ok:true,
            msg: `File:${fileName} created!!`
        })

    } catch(error){
        console.log(error)
        return res.status(500).json({
            ok:"false",
            msg:"error uploading file,please contact to support"
        })
    }
}

// getFileById
const getFileById = async(req, res) => {
    const id = req.params.id
    try {
        const file = await File.findById(id)
        if(!file) return res.status(404).json({
            ok: false,
            msg: 'File not found'
        })

        return res.status(200).json({
            ok: true,
            msg: 'Get ur file',
            file: file
        })
    } catch(error){
        console.log(error)
        return res.status(500).json({
            ok:false,
            msg:"error getting file by id, please contact to support"
        })
    }
}

// GetAllFiles
const getAllFiles = async(req, res) => {
    try {
        const files = await File.find().select('_id name')
        return res.status(200).json({
            ok: true,
            files: files
        })
    } catch(error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg:"error getting files, please contact to support"
        })
    }
}
// deleteFileById
const deleteFileById = async(req, res) => {
    const id = req.params.id
    try {
        const file = await File.findByIdAndDelete(id)
        if(!file) return res.status(400).json({
            ok: false,
            msg: 'Error deleting file with ID: ' + id
        })

        return res.status(200).json({
            ok: true,
            msg: 'File deleted!'
        })
    } catch(error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg:"error deleting, please contact to support"
        })
    }
}

module.exports = {
    uploadFile,
    getFileById,
    getAllFiles,
    deleteFileById
}




