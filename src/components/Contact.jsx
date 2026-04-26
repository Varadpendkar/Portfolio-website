import { useMemo, useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";

const makeCaptcha = () => {
  const a = Math.floor(Math.random() * 8) + 2;
  const b = Math.floor(Math.random() * 8) + 2;
  return { a, b, answer: a + b };
};

const isConfigured = (value) =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  !value.includes("your_");

const Contact = ({ resumeUrl }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    captcha: "",
  });
  const [captcha, setCaptcha] = useState(makeCaptcha());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "idle", text: "" });

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const env = useMemo(
    () => ({
      serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
      templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    }),
    [],
  );

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.message.trim()) {
      nextErrors.message = "Message is required.";
    }

    if (!form.subject.trim()) {
      nextErrors.subject = "Subject is required.";
    }

    if (Number(form.captcha) !== captcha.answer) {
      nextErrors.captcha = "Captcha answer is incorrect.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({ name: "", email: "", subject: "", message: "", captcha: "" });
    setCaptcha(makeCaptcha());
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setFeedback({ type: "idle", text: "" });

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const emailConfigReady = [
        env.serviceId,
        env.templateId,
        env.publicKey,
      ].every(isConfigured);

      if (!emailConfigReady) {
        throw new Error("EmailJS configuration is missing.");
      }

      await emailjs.send(
        env.serviceId,
        env.templateId,
        {
          from_name: form.name.trim(),
          reply_to: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        },
        { publicKey: env.publicKey },
      );

      setFeedback({
        type: "success",
        text: "Thanks! I’ll get back to you within 24 hours.",
      });
      resetForm();
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setFeedback({
        type: "error",
        text: "Email service is not configured or failed. Please email me directly at varadpendkar@gmail.com.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section contact-section" ref={ref}>
      <h2 className="section-title">Let&apos;s Build Together</h2>
      <p className="section-subtitle">Actively seeking ML/AI opportunities</p>

      <motion.div
        className="contact-layout"
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55 }}
      >
        <div className="contact-info glass-morphism">
          <a href="mailto:varadpendkar@gmail.com">
            <FiMail /> varadpendkar@gmail.com
          </a>
          <a href="tel:+917057568542">
            <FiPhone /> +91 7057568542
          </a>
          <p>
            <FiMapPin /> Pune, Maharashtra, India
          </p>
        </div>

        <form
          className="contact-form glass-morphism"
          onSubmit={onSubmit}
          noValidate
        >
          <label>
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              required
            />
            {errors.name && <small>{errors.name}</small>}
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
            />
            {errors.email && <small>{errors.email}</small>}
          </label>

          <label>
            Subject
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={onChange}
              required
            />
            {errors.subject && <small>{errors.subject}</small>}
          </label>

          <label>
            Message
            <textarea
              name="message"
              value={form.message}
              onChange={onChange}
              rows={5}
              required
            />
            {errors.message && <small>{errors.message}</small>}
          </label>

          <label>
            Captcha: {captcha.a} + {captcha.b} = ?
            <input
              type="number"
              name="captcha"
              value={form.captcha}
              onChange={onChange}
              required
            />
            {errors.captcha && <small>{errors.captcha}</small>}
          </label>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>

          {feedback.type !== "idle" && (
            <p className={`form-feedback ${feedback.type}`}>{feedback.text}</p>
          )}

          <a
            className="btn btn-outline resume-download"
            href={resumeUrl}
            download
          >
            📄 Download Full Resume
          </a>
        </form>
      </motion.div>
    </section>
  );
};

export default Contact;
