import {
  FaEnvelope,
  FaGithub,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import { SiKaggle } from "react-icons/si";

const links = [
  {
    label: "GitHub",
    href: "https://github.com/Varadpendkar",
    icon: <FaGithub />,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/varad-pendkar-0b4974253",
    icon: <FaLinkedinIn />,
  },
  {
    label: "Email",
    href: "mailto:varadpendkar@gmail.com",
    icon: <FaEnvelope />,
  },
  {
    label: "Kaggle",
    href: "https://www.kaggle.com/varadpendkar",
    icon: <SiKaggle />,
  },
  {
    label: "X / Twitter",
    href: "https://x.com/var99472",
    icon: <FaXTwitter />,
  },
];

const SocialSidebar = () => {
  return (
    <aside className="social-sidebar" aria-label="Social links">
      {links.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target={item.href.startsWith("mailto") ? "_self" : "_blank"}
          rel="noreferrer"
          aria-label={item.label}
          className="social-link"
        >
          <span className="social-icon">{item.icon}</span>
          <span className="social-tooltip">{item.label}</span>
        </a>
      ))}
      <span className="social-line" />
    </aside>
  );
};

export default SocialSidebar;
