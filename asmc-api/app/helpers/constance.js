export const userRoles = {
    ADMIN: "admin",
    USERS: "users",
}

export const FRONTEND_BASE_URL = 'https://asmcdae.in';

export const DEFAULT_OTP = "5699";

export const convert_to_user_mail_content = (username, password) => {
    return `
            You have been successfully registered with us, please make your payment to confirm your membership. Below is your account credentials
            Username: ${username}
            Password: Your username from email id and @asmc.
            Like example@gmail.com => example@asmc
        `;
}
export const add_new_family_member_mail_content = (name) => {
    return `
            We have received your request to add the new secondary family member in your account. The name of the family member is ${name}.
            Please make your payment to confirm your new membership of the family member.
        `;
}

export const payment_status_mail_content = `
    Your payment has been verified, you'll receive your account credentials very soon.
`

export const payment_status_decline_mail_content = `
    Your payment verification has been declined by admin, please contact us asap.
`

export const activity_new_mail_content = `
    Your booking is completed with ASMC. Please complete your payment through our secure online payment option by login using your credentials. Only after your payment is success you will be able to download your member card.
`