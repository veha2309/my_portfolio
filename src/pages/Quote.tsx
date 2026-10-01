import { Link, useLocation, useSearchParams } from 'react-router-dom';
import FreelanceInquiry from '../components/FreelanceInquiry';
import { inquiryReferences, serviceFromSlug } from '../data/inquiry';

export default function Quote() {
  const [params] = useSearchParams();
  const location = useLocation();
  const referenceSlug = params.get('reference');
  const reference = referenceSlug && Object.hasOwn(inquiryReferences, referenceSlug) ? inquiryReferences[referenceSlug] : undefined;
  return <main id="main" tabIndex={-1} className="studio-quote-page"><div id="top" /><div className="container"><Link className="back-link" to="/">← BACK TO THE STUDIO</Link></div><FreelanceInquiry key={location.search} initialService={serviceFromSlug(params.get('service'))} reference={reference} /></main>;
}
