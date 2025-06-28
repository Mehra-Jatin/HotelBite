
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Hotel from '../models/hotelModel.js';
import Restaurant from '../models/restaurantModel.js';



// Register a new hotel
export const register = async (req, res) => {
    const { name, phoneNo, email, password, role } = req.body;

    try {
        if(!name || !phoneNo || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        let newUser = "";

        const hashedPassword = await bcrypt.hash(password, 10);

       if( role == 'hotel'){
           const existingHotel = await Hotel.findOne({ email });
           if (existingHotel) {
               return res.status(400).json({ message: 'Hotel with this email already exists' });
           }

         newUser = new Hotel({
            name,
            phoneNo,
            email,
            password: hashedPassword,
            role,
        });

       await newUser.save();
       }
       else{
              const existingRestaurant = await Restaurant.findOne({ email });
              if (existingRestaurant) {
                return res.status(400).json({ message: 'Restaurant with this email already exists' });
              }
    
            newUser = new Restaurant({
                name,
                phoneNo,
                email,
                password: hashedPassword,
                role,
          });
          await newUser.save();
       }
        
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

         res.status(201).json({
                id: newUser._id,
                name: newUser.name,
                phoneNo: newUser.phoneNo,
                email: newUser.email,
                role: newUser.role,
            });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });

    }
}


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
           
        let user = "";
        user = await Hotel.findOne({ email });
        if (!user) {
            user = await Restaurant.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(200).json({
            id: user._id,
            name: user.name,
            phoneNo: user.phoneNo,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Error logging in user', error: error.message });
    }
};


export const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};

