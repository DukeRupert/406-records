import { CONTACT_FORM_EMAIL } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import postmarkClient from '$lib/postmark';
import type { Actions } from './$types';

interface ContactFormData {
    name: string;
    email: string;
    phone: string;
}

function validateForm(formData: ContactFormData) {
    const errors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.name || formData.name.length < 2) {
        errors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.email || !formData.email.includes('@')) {
        errors.email = 'Please enter a valid email address';
    }

    // Basic phone validation - can be made more strict if needed
    if (!formData.phone || formData.phone.length < 10) {
        errors.phone = 'Please enter a valid phone number';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const data: ContactFormData = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string
        };

        const { isValid, errors } = validateForm(data);

        if (!isValid) {
            return fail(400, { errors, data });
        }

        try {
            await postmarkClient.sendEmail({
                From: CONTACT_FORM_EMAIL,
                To: CONTACT_FORM_EMAIL,
                Subject: '406 Records - New Contact Form Submission',
                TextBody: `
                    New contact form submission from ${data.name}

                    Details:
                    - Name: ${data.name}
                    - Email: ${data.email}
                    - Phone: ${data.phone}

                    Please respond within 24 hours.
                `,
                HtmlBody: `
                    <h2>New contact form submission from ${data.name}</h2>

                    <h3>Contact Details:</h3>
                    <ul>
                    <li><strong>Name:</strong> ${data.name}</li>
                    <li><strong>Email:</strong> ${data.email}</li>
                    <li><strong>Phone:</strong> ${data.phone}</li>
                    </ul>

                    <p><em>Please respond within 24 hours.</em></p>
                `
            });

            return {
                success: true,
                message: 'Thank you for your message. We will be in touch soon!'
            };
        } catch (error) {
            console.error('Failed to send email:', error);
            return fail(500, {
                success: false,
                message: 'Failed to send message. Please try again later.'
            });
        }
    }
} satisfies Actions;