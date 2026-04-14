const supabase = require('../utils/supabase');
const multer = require('multer');

// Configure Multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a file' });
    }

    const file = req.file;
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('event-images')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      throw error;
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('event-images')
      .getPublicUrl(filePath);

    res.json({ url: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Error uploading image to Supabase' });
  }
};

exports.uploadMiddleware = upload.single('image');
