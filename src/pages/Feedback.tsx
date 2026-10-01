import { Link } from 'react-router-dom';
import FeedbackForm from '../components/FeedbackForm';

export default function Feedback() {
  return <main id="main" tabIndex={-1} className="studio-feedback-page container"><div id="top" /><Link className="back-link" to="/">← BACK TO THE STUDIO</Link><h1>Help the studio <em>grow.</em></h1><FeedbackForm /></main>;
}
