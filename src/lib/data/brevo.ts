"use server"

/**
 * Subscribe a user to the newsletter using Brevo API
 * @param email - The email address to subscribe
 * @param firstName - Optional first name of the subscriber
 * @returns Success or error message
 */
export async function subscribeToNewsletter(
  email: string,
  firstName?: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Validate email
    if (!email || !email.includes("@")) {
      return {
        success: false,
        message: "Please provide a valid email address",
      }
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY

    const BREVO_LIST_ID = process.env.BREVO_LIST_ID

    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        attributes: firstName ? { FIRSTNAME: firstName } : undefined,
        listIds: [parseInt(BREVO_LIST_ID)],
        updateEnabled: true,
      }),
    })

    const data = await response.json()

    // Handle success
    if (response.ok || response.status === 204 || response.status === 201) {
      return {
        success: true,
        message: "Successfully subscribed! Welcome to the circle.",
      }
    }

    // Handle duplicate contact (already subscribed)
    if (response.status === 400 && data.code === "duplicate_parameter") {
      return {
        success: true,
        message: "You are already subscribed!",
      }
    }

    // Handle other errors
    return {
      success: false,
      message: data.message || "Subscription failed. Please try again.",
    }
  } catch (error) {
    console.error("Brevo API Error:", error)
    return {
      success: false,
      message: "An error occurred. Please try again later.",
    }
  }
}

/**
 * Form action for newsletter subscription (can be used with useFormState)
 * @param prevState - Previous state from form
 * @param formData - Form data containing email and optional name
 */
export async function subscribeToNewsletterAction(
  prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const email = formData.get("email")?.toString() || ""
  const firstName = formData.get("firstName")?.toString()

  return await subscribeToNewsletter(email, firstName)
}
