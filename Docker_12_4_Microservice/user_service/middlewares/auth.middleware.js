import axios from "axios";
import { PORT_AUTH_SERVICE} from "../config/env.js";
import { log } from "console";

export const authorize = async (req, res, next) => {
  const token = req.headers.authorization;
  const phone = req.body.phone;
  console.log("phone ne = " , phone);
  
  if (!token) return res.status(401).json({ error: "No token" });
 
  try {
    const response = await axios.post(
      `http://localhost:${PORT_AUTH_SERVICE}/api/v1/auth/validate-token`,
      phone ,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
  
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
