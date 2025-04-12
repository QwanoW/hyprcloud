import { Link } from "@inertiajs/react";
import { Cloud } from "lucide-react";
import { useLaravelReactI18n } from "laravel-react-i18n";

const linksData = {
  social: [
    { name: "Twitter", href: "#" },
    { name: "Facebook", href: "#" },
    { name: "LinkedIn", href: "#" },
  ],
  product: [
    { name: "Features", key: 'features', href: "#" },
    { name: "Pricing", key: 'pricing', href: "#" },
    { name: "Security", key: 'security', href: "#" },
    { name: "Integrations", key: 'integrations', href: "#" },
  ],
  resources: [
    { name: "Documentation", key: 'documentation', href: "#" },
    { name: "Blog", key: 'blog', href: "#" },
    { name: "Support Center", key: 'support', href: "#" },
    { name: "Status", key: 'status', href: "#" },
  ],
  company: [
    { name: "About Us", key: 'about', href: "/pages/about-us" },
    { name: "Careers", key: 'careers', href: "/career" },
    { name: "Leave a Testimonial", key: 'testimonial', href: "/testimonials/create" },
    { name: "Privacy Policy", key: 'privacy', href: "/pages/privacy-policy" },
    { name: "Terms of Service", key: 'terms', href: "/pages/terms-of-service" },
  ],
};

export function Footer() {
  const { t } = useLaravelReactI18n();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Cloud className="text-primary h-6 w-6" />
              <span className="text-xl font-bold">Hyprcloud</span>
            </div>
            <p className="text-muted-foreground text-sm">
              {t('home.description')}
            </p>
            <div className="mt-4 flex gap-4">
              {linksData.social.map((item) => {
                let icon;
                switch (item.name) {
                  case "Twitter":
                    icon = (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                    );
                    break;
                  case "Facebook":
                    icon = (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                    );
                    break;
                  case "LinkedIn":
                    icon = (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                    );
                    break;
                  default:
                    icon = null;
                }
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={item.name}
                  >
                    {icon}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Section Product */}
          <div>
            <h3 className="mb-4 font-medium">{t('home.product_title')}</h3>
            <ul className="space-y-2">
              {linksData.product.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    {t(`home.product_link_${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section Resources */}
          <div>
            <h3 className="mb-4 font-medium">{t('home.resources_title')}</h3>
            <ul className="space-y-2">
              {linksData.resources.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    {t(`home.resources_link_${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section Company */}
          <div>
            <h3 className="mb-4 font-medium">{t('home.company_title')}</h3>
            <ul className="space-y-2">
              {linksData.company.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    {t(`home.company_link_${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-muted-foreground mt-12 border-t pt-8 text-center text-sm">
          <p>{t('home.copyright', { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
}