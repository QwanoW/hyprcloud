<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PageSeeder extends Seeder
{
    public function run()
    {
        // Privacy Policy
        Page::create([
            'slug' => 'privacy-policy',
            'title' => 'Privacy Policy',
            // Make sure lines inside the string start at the very beginning
            // (relative to the string definition) unless they are intentionally code blocks.
            'content' => <<<MARKDOWN
# Privacy Policy

Last Updated: April 3, 2025

## 1. Introduction

Welcome to Hyprcloud ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our cloud storage service.

## 2. Information We Collect

### 2.1 Personal Information

We may collect the following types of personal information:

- Account Information: Name, email address, phone number, and billing information when you register for an account.
- Profile Information: Information you provide in your user profile.
- Subscription Details: Information about your subscription plan and payment history.
- User Content: Files and data you upload to our service.

### 2.2 Usage Information

We automatically collect certain information about how you use our service, including:

- Log Data: IP address, browser type, pages visited, time and date of visits, and other statistics.
- Device Information: Device type, operating system, and unique device identifiers.
- File Metadata: File names, sizes, types, and modification dates.

## 3. How We Use Your Information

We use your information for the following purposes:

- To provide, maintain, and improve our services.
- To process transactions and manage your account.
- To respond to your inquiries and provide customer support.
- To send service-related notifications and updates.
- To monitor and analyze usage patterns and trends.
- To detect, prevent, and address technical issues and security threats.
- To comply with legal obligations.

## 4. Data Storage and Security

We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, accidental loss, or destruction. Your files are encrypted both during transmission and while stored on our servers. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.

## 5. Sharing Your Information

We may share your information with:

- Service Providers: Third-party vendors and service providers who help us operate our business and provide services.
- Business Partners: Trusted partners with whom we collaborate to offer integrated services.
- Legal Requirements: When required by law, legal process, or government authorities.
- Business Transfers: In connection with a merger, acquisition, reorganization, or sale of assets.

## 6. Your Choices and Rights

Depending on your location, you may have certain rights regarding your personal information, including:

- Access: Request access to personal information we hold about you.
- Correction: Request correction of inaccurate or incomplete information.
- Deletion: Request deletion of your personal information and content.
- Portability: Request transfer of your information to another service.
- Opt-out: Opt-out of marketing communications and certain data processing.

## 7. Cookies and Similar Technologies

We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can control cookie settings through your browser preferences.

## 8. International Data Transfers

Your information may be transferred to and processed in countries other than your country of residence. We take appropriate safeguards to ensure the protection of your information when transferred internationally.

## 9. Children's Privacy

Our services are not intended for individuals under the age of 16. We do not knowingly collect personal information from children without verifiable parental consent.

## 10. Changes to This Privacy Policy

We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of any material changes through our website or by email.

## 11. Contact Us

If you have any questions or concerns about this Privacy Policy, please contact us at privacy@hyprcloud.com.
MARKDOWN,
            'last_updated' => Carbon::now(),
        ]);

        // Terms of Service - APPLY THE SAME FIX HERE (Remove indentation)
        Page::create([
            'slug' => 'terms-of-service',
            'title' => 'Terms of Service',
            'content' => <<<MARKDOWN
# Terms of Service

Last Updated: April 3, 2025

## 1. Acceptance of Terms

By accessing or using Hyprcloud's services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.

## 2. Service Description

Hyprcloud provides cloud storage services that allow users to upload, store, share, download, and manage digital files. Our services are available through our website and applications, subject to these Terms.

## 3. Account Registration and Security

To use our services, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to:

- Provide accurate and complete information when creating your account.
- Update your information to keep it current.
- Notify us immediately of any unauthorized access or use of your account.
- Not share your account credentials with third parties.

## 4. Subscription Plans and Payments

Hyprcloud offers various subscription plans with different storage capacities and features. By subscribing to a paid plan, you agree to:

- Pay all fees associated with your selected plan.
- Provide accurate billing information.
- Authorize us to charge your payment method for subscription fees.

Subscription fees are charged at the beginning of each billing cycle. We may change our fees upon notice, and continued use of our services after such notice constitutes acceptance of the new fees.

## 5. User Content

### 5.1 Ownership

You retain all ownership rights to the content you upload to our services. By uploading content, you grant us a limited license to store, display, and process your content solely for the purpose of providing our services to you.

### 5.2 Prohibited Content

You agree not to upload, store, or share content that:

- Violates any applicable laws or regulations.
- Infringes upon intellectual property rights of others.
- Contains malware, viruses, or harmful code.
- Is defamatory, obscene, or offensive.
- Promotes illegal activities or harms minors.

## 6. User Conduct

When using our services, you agree not to:

- Attempt to gain unauthorized access to our systems or other users' accounts.
- Use our services for any illegal or unauthorized purpose.
- Interfere with or disrupt the integrity or performance of our services.
- Circumvent our security measures or service limitations.
- Engage in activities that impose an unreasonable load on our infrastructure.

## 7. Termination

We may suspend or terminate your access to our services if:

- You breach these Terms.
- You fail to pay subscription fees.
- We are required to do so by law.
- Continued provision of services to you is commercially infeasible.

Upon termination, your right to use our services ceases immediately, and we may delete your content after a grace period.

## 8. Service Availability and Modifications

We strive to ensure that our services are available at all times, but do not guarantee uninterrupted access. We may modify, suspend, or discontinue any aspect of our services at any time, with or without notice.

## 9. Disclaimers and Limitations of Liability

OUR SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR OUR SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

## 10. Indemnification

You agree to indemnify and hold harmless Hyprcloud, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including attorneys' fees) arising from your use of our services or violation of these Terms.

## 11. Governing Law and Dispute Resolution

These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction]. Any dispute arising from these Terms shall be resolved through arbitration in accordance with the rules of [Arbitration Association].

## 12. Changes to Terms

We may update these Terms from time to time. We will notify you of material changes through our website or by email. Your continued use of our services after such changes constitutes acceptance of the new Terms.

## 13. Contact Information

If you have any questions about these Terms, please contact us at legal@hyprcloud.com.
MARKDOWN,
            'last_updated' => Carbon::now(),
        ]);

        Page::create([
            'slug' => 'about-us',
            'title' => 'About Us',
            'content' => <<<MARKDOWN
# About Hyprcloud

## Our Mission

At Hyprcloud, we're on a mission to provide secure, reliable, and user-friendly cloud storage solutions that empower individuals and businesses to store, access, and share their digital assets with confidence.

## Who We Are

Founded in 2023, Hyprcloud emerged from a simple idea: cloud storage should be both powerful and straightforward. Our team of experienced engineers, designers, and security experts came together with a shared vision of creating a storage platform that combines enterprise-grade security with consumer-grade simplicity.

We are a diverse and passionate team dedicated to innovation and excellence in cloud technology. With decades of combined experience in data management, cybersecurity, and user experience design, we've built a platform that addresses the real needs of modern digital users.

## What Sets Us Apart

### Security First

We implement end-to-end encryption and advanced security protocols to ensure your data remains private and protected. Your files are encrypted both in transit and at rest, with only you holding the keys to your data.

### Seamless Experience

We've designed our platform with user experience at its core. From intuitive file sharing to one-click downloads and ZIP archive creation, every feature is optimized for simplicity and efficiency.

### Flexible Solutions

Whether you're an individual looking to back up personal photos, a freelancer sharing large files with clients, or an enterprise managing terabytes of data, our range of subscription plans offers the perfect solution for your needs.

### Reliable Infrastructure

Built on a distributed cloud architecture, Hyprcloud ensures high availability and rapid access to your files from anywhere in the world. Our redundant storage systems guarantee data durability even in the face of hardware failures.

## Our Values

- **Privacy:** We believe your data belongs to you, and we design all our systems with privacy as a fundamental principle.
- **Transparency:** We communicate openly about our practices, policies, and any changes that might affect our users.
- **Innovation:** We continuously refine our technology to stay ahead of evolving security threats and user needs.
- **Reliability:** We understand that you depend on our service to access important files, and we take that responsibility seriously.
- **Sustainability:** We optimize our operations to minimize environmental impact and contribute to a more sustainable digital ecosystem.

## Our Technology

Hyprcloud leverages cutting-edge technologies to deliver a superior cloud storage experience:

- Advanced encryption algorithms to protect your data
- Distributed storage architecture for maximum reliability
- Intelligent caching systems for rapid file access
- Adaptive bandwidth management for smooth uploads and downloads
- Comprehensive version control to protect against accidental changes

## Join Us

Whether you're looking for a secure place to store your memories, a reliable way to share large files, or a comprehensive solution for your organization's data management needs, Hyprcloud is here to help. Join thousands of satisfied users who trust us with their valuable digital assets.

Ready to experience the future of cloud storage? [Sign up today](/signup) and discover why Hyprcloud is the storage solution you've been waiting for.

## Contact Us

Have questions or feedback? We'd love to hear from you.

Email: info@hyprcloud.com
Support: support@hyprcloud.com
Phone: +1 (555) 123-4567
MARKDOWN,
            'last_updated' => Carbon::now(),
        ]);
    }
}