import jwt from "jsonwebtoken";



// authorization logic
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token === null) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }
  
    jwt.verify(token, 'securityKey', (err, user) => {
      if (err) {
        return res.status(403).json({ message: err.message });
      }
      req.id = user;
      next();
    });
}



// upload image files
const uploadImage = (file, filepath) => {
  const new_path = filepath+file.name;

  file.mv(new_path, (err) => {
      if(err) throw err
  });
  console.log(new_path);
  return new_path;
}



export { authenticateToken, uploadImage};