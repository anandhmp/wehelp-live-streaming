import { useState } from 'react';
import styles from './ShareCard.module.scss';
import Icon from '../components/Icon';
import Button from '../components/Button';

export default function ShareCard({
  shareUrl = 'https://yourdomain.com/live-streaming',
  shareText = 'Secure live view:',
}) {
  const [copied, setCopied] = useState(false);

  const handleWhatsApp = () => {
    const msg = `${shareText}\n${shareUrl}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(msg)}`,
      '_blank',
      'noopener'
    );
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const t = document.createElement('textarea');
        t.value = shareUrl;
        t.style.position = 'fixed';
        t.style.opacity = '0';
        document.body.appendChild(t);
        t.select();
        document.execCommand('copy');
        t.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* noop */
    }
  };

  return (
    <div className={styles.share}>
      <h3>Share the Live View</h3>
      <p>Share this secure viewing link with authorized investors and stakeholders.</p>
      <div className={styles.btnRow}>
        <Button variant="wa" onClick={handleWhatsApp}>
          <Icon name="whatsapp" size={21} />
          Share via WhatsApp
        </Button>
        <Button
          variant={copied ? 'copied' : 'copy'}
          onClick={handleCopy}
        >
          <Icon name="copy" size={18} strokeWidth={2} />
          <span>{copied ? '✓ Link Copied' : 'Copy Link'}</span>
        </Button>
      </div>
    </div>
  );
}