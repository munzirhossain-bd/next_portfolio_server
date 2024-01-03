import { Resend } from 'resend';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 5000;
const app= express();
const resend = new Resend(`re_FHwqx8c1_4FJ1SaWEaP5j4QcKsBtbgL6V`);
app.use(cors());
app.use(express.json());
async function bootstrap() {
      try {
        await mongoose.connect(`mongodb+srv://munzirhossain072:FfOaD3fl6DmodhYB@cluster0.mzjannn.mongodb.net/portfolio?retryWrites=true&w=majority`,{
          useNewUrlParser:true,
          useUnifiedTopology: true,
        });
        console.log(`🛢 Database connection successful`);
         mongoose.connection.on('connected', () => {
          console.log('Connected to MongoDB');
        });
          mongoose.connection.on('error', (err) => {
          console.error(`MongoDB connection error: ${err}`);
        });

        app.get('/',(req,res)=>{
            res.status(200).json("Okay");
        })

        app.post("/", async (req,res) => {
            const {name,email,subject,message}= await req.body;
            const { data, error } = await resend.emails.send({
              from: "Acme <onboarding@resend.dev>",
              to: ["delivered@resend.dev"],
              subject: `${subject}`,
              html:`<p>Name:${name} Email:${email} Subject:${subject} Message:${message}</p>`,
            });
          
            if (error) {
              return res.status(400).json({ error });
            }
          
            res.status(200).json(data); 
            console.log(data)
          });

         
        app.listen(port, () => {
          console.log(`Server is  listening on port ${port}`);
        });
      } catch (err) {
        console.log(`Failed to connect database`, err);
      }
    }
    bootstrap();