const nodemailer = require("nodemailer");

// Check if real email credentials are configured
const isEmailConfigured = process.env.EMAIL_PASS && process.env.EMAIL_PASS !== "YOUR_APP_PASSWORD_HERE";

// Create transporter (only if configured)
let transporter = null;
if (isEmailConfigured) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email to customer/worker
const sendOTPEmail = async (email, otp, name) => {
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #1a1015; border-radius: 16px; overflow: hidden; border: 1px solid #3a2030;">
      <div style="background: linear-gradient(135deg, #e11d48, #9f1239); padding: 32px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 28px; font-family: Georgia, serif;">🍽️ Prajna's Kitchen</h1>
        <p style="color: #fecdd3; margin: 8px 0 0;">Secure Verification</p>
      </div>
      <div style="padding: 32px; color: #e8d5dc;">
        <p style="font-size: 16px; margin-bottom: 8px;">Hello <strong style="color: #fca5a5;">${name}</strong>,</p>
        <p style="font-size: 14px; color: #a08090; margin-bottom: 24px;">Use the verification code below to complete your registration:</p>
        <div style="background: #2a1520; border: 2px solid #e11d48; border-radius: 12px; padding: 24px; text-align: center; margin: 0 auto;">
          <p style="font-size: 14px; color: #a08090; margin: 0 0 8px;">Your Verification Code</p>
          <h2 style="font-size: 40px; letter-spacing: 12px; color: #e11d48; margin: 0; font-family: 'Courier New', monospace;">${otp}</h2>
        </div>
        <p style="font-size: 13px; color: #705060; margin-top: 24px; text-align: center;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
      </div>
      <div style="background: #150d10; padding: 16px; text-align: center; border-top: 1px solid #3a2030;">
        <p style="font-size: 12px; color: #605060; margin: 0;">© 2026 Prajna's Kitchen — Exquisite Dining</p>
      </div>
    </div>
  `;

  if (transporter) {
    await transporter.sendMail({
      from: `"Prajna's Kitchen" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🔐 Your Verification Code: ${otp}`,
      html: htmlContent
    });
    console.log(`📧 OTP email sent to ${email}`);
  } else {
    // DEV MODE: Log OTP to console
    console.log(`\n${"=".repeat(50)}`);
    console.log(`📧 DEV MODE — OTP for ${email}: ${otp}`);
    console.log(`${"=".repeat(50)}\n`);
  }
};

// Notify manager about a new worker application
const sendWorkerRequestNotification = async (workerDetails) => {
  const managerEmail = process.env.MANAGER_EMAIL;
  
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #1a1015; border-radius: 16px; overflow: hidden; border: 1px solid #3a2030;">
      <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 32px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">📋 New Staff Application</h1>
        <p style="color: #a7f3d0; margin: 8px 0 0;">Prajna's Kitchen — Manager Portal</p>
      </div>
      <div style="padding: 32px; color: #e8d5dc;">
        <p style="font-size: 16px; margin-bottom: 20px;">A new staff member has applied to join your team:</p>
        <div style="background: #2a1520; border-radius: 12px; padding: 20px; border-left: 4px solid #10b981;">
          <p style="margin: 4px 0;"><strong style="color: #a08090;">Name:</strong> <span style="color: #fca5a5;">${workerDetails.name}</span></p>
          <p style="margin: 4px 0;"><strong style="color: #a08090;">Email:</strong> <span style="color: #fca5a5;">${workerDetails.email}</span></p>
          <p style="margin: 4px 0;"><strong style="color: #a08090;">Phone:</strong> <span style="color: #fca5a5;">${workerDetails.phone || "N/A"}</span></p>
          <p style="margin: 4px 0;"><strong style="color: #a08090;">Role:</strong> <span style="color: #10b981; text-transform: uppercase; font-weight: 700;">${workerDetails.role}</span></p>
        </div>
        <p style="font-size: 14px; color: #a08090; margin-top: 20px; text-align: center;">Log in to the Manager Dashboard to approve or reject this application.</p>
      </div>
    </div>
  `;

  if (transporter) {
    await transporter.sendMail({
      from: `"Prajna's Kitchen" <${process.env.EMAIL_USER}>`,
      to: managerEmail,
      subject: `📋 New Staff Application: ${workerDetails.name} (${workerDetails.role})`,
      html: htmlContent
    });
    console.log(`📧 Manager notification sent for worker: ${workerDetails.name}`);
  } else {
    console.log(`\n${"=".repeat(50)}`);
    console.log(`📋 DEV MODE — New worker application:`);
    console.log(`   Name: ${workerDetails.name}`);
    console.log(`   Email: ${workerDetails.email}`);
    console.log(`   Role: ${workerDetails.role}`);
    console.log(`${"=".repeat(50)}\n`);
  }
};

// Notify worker about approval/rejection (Selection Email)
const sendWorkerDecisionEmail = async (workerEmail, workerName, approved, role) => {
  const status = approved ? "Selected ✅" : "Not Selected ❌";
  const color = approved ? "#10b981" : "#ef4444";
  const gradient = approved ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #ef4444, #b91c1c)";

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 550px; margin: 0 auto; background: #1a1015; border-radius: 20px; overflow: hidden; border: 1px solid #3a2030; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
      <div style="background: ${gradient}; padding: 40px 20px; text-align: center;">
        <div style="font-size: 50px; margin-bottom: 10px;">${approved ? '🎉' : '✉️'}</div>
        <h1 style="color: #fff; margin: 0; font-size: 28px; letter-spacing: 1px; font-family: Georgia, serif;">Application ${status}</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0; text-transform: uppercase; font-size: 12px; letter-spacing: 2px;">Prajna's Kitchen — Official Selection</p>
      </div>
      
      <div style="padding: 40px; color: #e8d5dc; line-height: 1.6;">
        <p style="font-size: 18px; margin-top: 0;">Dear <strong style="color: #fca5a5;">${workerName}</strong>,</p>
        
        ${approved ? `
          <p style="font-size: 15px;">Congratulations! We are delighted to inform you that you have been <strong>selected</strong> to join the culinary team at <span style="color: #fca5a5;">Prajna's Kitchen</span>.</p>
          
          <div style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center;">
            <p style="margin: 0; color: #a7f3d0; text-transform: uppercase; font-size: 11px; font-weight: 700; letter-spacing: 1px;">Assigned Role</p>
            <h2 style="margin: 5px 0; color: #fff; font-size: 24px; text-transform: capitalize;">${role}</h2>
          </div>

          <p style="font-size: 14px; color: #a08090;">Your account is now fully activated. You can access your specialized staff dashboard immediately using the button below.</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/worker-login" style="background: #e11d48; color: #fff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 700; font-size: 16px; display: inline-block; transition: 0.3s;">Access Staff Portal</a>
          </div>
        ` : `
          <p style="font-size: 15px;">Thank you for your interest in joining <span style="color: #fca5a5;">Prajna's Kitchen</span>.</p>
          <p style="font-size: 14px; color: #a08090;">After carefully reviewing your application, we regret to inform you that we will not be moving forward with your selection at this time.</p>
          <p style="font-size: 14px; color: #a08090;">We wish you the very best in your future culinary endeavors.</p>
        `}

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #3a2030; text-align: center;">
          <p style="font-size: 12px; color: #605060; margin: 0;">Warm regards,</p>
          <p style="font-size: 14px; color: #fca5a5; font-weight: 700; margin: 5px 0 0;">Management Team</p>
          <p style="font-size: 11px; color: #605060;">Prajna's Kitchen | Exquisite Dining Experience</p>
        </div>
      </div>
    </div>
  `;

  if (transporter) {
    await transporter.sendMail({
      from: `"Prajna's Kitchen" <${process.env.EMAIL_USER}>`,
      to: workerEmail,
      subject: approved ? `🥳 Welcome to the Team, ${workerName}!` : `Application Status — Prajna's Kitchen`,
      html: htmlContent
    });
  } else {
    console.log(`\n📧 DEV MODE — Worker selection: ${workerName} — ${status} (${role})`);
  }
};

module.exports = { generateOTP, sendOTPEmail, sendWorkerRequestNotification, sendWorkerDecisionEmail };
