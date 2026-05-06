// PSYConnect - Email Service
// Usando Resend. Si no hay RESEND_API_KEY, las funciones loguean y devuelven ok.

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "PSYConnect <hola@psyconnect.es>";
const TEAM_EMAIL = process.env.TEAM_EMAIL || "equipo@psyconnect.es";

interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}): Promise<EmailResult> {
  if (!RESEND_API_KEY) {
    console.log("[email] No RESEND_API_KEY configured. Email would be sent:");
    console.log("[email] TO:", options.to);
    console.log("[email] SUBJECT:", options.subject);
    return { success: true, id: "placeholder" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.message };
    }
    return { success: true, id: data.id };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// 1. Confirmación al paciente tras completar funnel
export async function sendPatientConfirmation(patient: {
  name: string;
  email: string;
}): Promise<EmailResult> {
  return sendEmail({
    to: patient.email,
    subject: "Hemos recibido tus respuestas – PSYConnect",
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #333;">
        <h1 style="color: #3a673a; font-size: 22px;">Hola, ${patient.name}</h1>
        <p>Hemos recibido tus respuestas y estamos revisando la información para buscar una opción que pueda encajar contigo.</p>
        <p>Te contactaremos en breve con una recomendación personalizada.</p>
        <p style="color: #666; font-size: 14px;">Recuerda que PSYConnect no es un servicio de urgencias. Si en algún momento necesitas ayuda inmediata, llama al 112 o al 024 (atención a la conducta suicida).</p>
        <p style="margin-top: 32px; color: #999; font-size: 13px;">Equipo PSYConnect</p>
      </div>
    `,
  });
}

// 2. Notificación interna al equipo cuando entra un nuevo paciente
export async function sendNewPatientAlert(patient: {
  name: string;
  email: string;
  reason: string | null;
  modality: string | null;
  budget: string | null;
}): Promise<EmailResult> {
  return sendEmail({
    to: TEAM_EMAIL,
    subject: `[PSYConnect] Nuevo paciente: ${patient.name}`,
    html: `
      <div style="font-family: monospace; max-width: 560px; margin: 0 auto; color: #333;">
        <h2>Nuevo paciente recibido</h2>
        <ul>
          <li><strong>Nombre:</strong> ${patient.name}</li>
          <li><strong>Email:</strong> ${patient.email}</li>
          <li><strong>Motivo:</strong> ${patient.reason || "no especificado"}</li>
          <li><strong>Modalidad:</strong> ${patient.modality || "no especificado"}</li>
          <li><strong>Presupuesto:</strong> ${patient.budget || "no especificado"}</li>
        </ul>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/pacientes">Ver en el panel →</a></p>
      </div>
    `,
  });
}

// 3. Email al paciente con la recomendación
export async function sendRecommendation(options: {
  patientName: string;
  patientEmail: string;
  psychologistName: string;
  psychologistSpecialties: string[];
  customMessage?: string;
}): Promise<EmailResult> {
  return sendEmail({
    to: options.patientEmail,
    subject: "Tu recomendación de psicólogo – PSYConnect",
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #333;">
        <h1 style="color: #3a673a; font-size: 22px;">Hola, ${options.patientName}</h1>
        <p>Hemos revisado tus respuestas y encontramos una opción que puede encajar bien contigo:</p>
        <div style="background: #f4f7f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <strong style="font-size: 18px;">${options.psychologistName}</strong><br/>
          <span style="color: #666;">${options.psychologistSpecialties.join(", ")}</span>
        </div>
        ${options.customMessage ? `<p>${options.customMessage}</p>` : ""}
        <p>Nos pondremos en contacto para ayudarte a dar el siguiente paso.</p>
        <p style="color: #666; font-size: 14px; margin-top: 24px;">Esta es una recomendación personalizada, no una garantía clínica. La primera sesión sirve también para verificar el encaje.</p>
        <p style="margin-top: 32px; color: #999; font-size: 13px;">Equipo PSYConnect</p>
      </div>
    `,
  });
}

// 4. Email al psicólogo para confirmar disponibilidad
export async function sendPsychologistAvailabilityCheck(options: {
  psychologistName: string;
  psychologistEmail: string;
  patientSummary: string;
}): Promise<EmailResult> {
  return sendEmail({
    to: options.psychologistEmail,
    subject: "[PSYConnect] Consulta de disponibilidad para nuevo paciente",
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #333;">
        <h2>Hola, ${options.psychologistName}</h2>
        <p>Tenemos un potencial nuevo paciente que podría encajar contigo. Antes de realizar la recomendación, queremos confirmar tu disponibilidad.</p>
        <div style="background: #f4f7f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          ${options.patientSummary}
        </div>
        <p>Por favor, responde a este email confirmando si tienes disponibilidad en las próximas semanas.</p>
        <p style="margin-top: 32px; color: #999; font-size: 13px;">Equipo PSYConnect</p>
      </div>
    `,
  });
}
