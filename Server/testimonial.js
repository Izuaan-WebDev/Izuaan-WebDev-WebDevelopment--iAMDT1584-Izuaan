const express = require("express");
const cors = require("cors");
// const monk = require('monk');
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("example.db");
const nodemailer = require("nodemailer");
const z = require("zod");

const app = express();

// const db = monk('localhost/Assignment');
// const testimonials = db.get('testimonials');

app.use(cors());
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data

const asyncMiddleware = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get("/", (req, res) => {
  res.json({
    message: "Server Check By Izuaan",
  });
});

app.get(
  "/testimonials",
  asyncMiddleware(async (req, res) => {
    const data = [];
    db.each(
      "SELECT * FROM testimonial",
      function (err, row) {
        data.push(row);
        console.log(row);
      },
      () => {
        res.json(data);
      }
    );
  })
);

function isValidTestimonial(testimonial) {
  return (
    testimonial.Fname &&
    testimonial.Fname.toString().trim() !== "" &&
    testimonial.Cname &&
    testimonial.Cname.toString().trim !== "" &&
    testimonial.Content &&
    testimonial.Content.toString().trim !== ""
  );
}

app.post(
  "/testimonials",
  asyncMiddleware(async (req, res) => {
    if (isValidTestimonial(req.body)) {
      const testimonial = {
        Fname: req.body.Fname.toString(),
        Cname: req.body.Cname.toString(),
        Content: req.body.Content.toString(),
      };
      await db.run(
        `INSERT INTO testimonial(fullname, company_name, comment) VALUES(?, ?, ?)`,
        [testimonial.Fname, testimonial.Cname, testimonial.Content],
        function (err) {
          if (err) {
            return console.log(err.message);
          }
          // get the last insert id
          console.log(`A row has been inserted with rowid ${this.lastID}`);
        }
      );

      // close the database connection
      res.status(200);
      res.json({
        message: "New testimonial added!",
      });
    } else {
      res.status(422);
      res.json({
        message: "Hey fill out all the boxes please!",
      });
    }
  })
);

// Handle form submission
app.post("/contact", async (req, res) => {
  const validationSchmea = z.object({
    Dname: z.string().min(3),
    Email: z.string().email(),
    Message: z.string().min(3),
  });
  const validatedSchema = validationSchmea.safeParse(req.body);

  console.log(validatedSchema);

  if (!validatedSchema.success) {
    res.status(422);
    return res.json({
      message: validatedSchema.error.format(),
    });
  }

  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "izuaantest123@gmail.com",
      pass: "zjazehxkbnboztjq",
    },
  });

  // Set up email options
  const mailOptions = {
    from: "izuaantest123@gmail.com",
    to: validatedSchema.data.Email,
    subject: "New message from your website",
    html: `
      <h2>New message from your website</h2>
      <p>Name: ${validatedSchema.data.Dname}</p>
      <p>Address: ${validatedSchema.data.Email}</p>
      <p>Message: ${validatedSchema.data.Message}</p>
    `,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    return res.json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    return res.json({ message: "Error sending email." });
  }
});

app.listen(5000, () => {
  console.log("listening on http://localhost:5000");
});
