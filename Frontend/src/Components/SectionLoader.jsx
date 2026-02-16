export default function SectionLoader({ message = "Loading..." }) {
  return (
    <div className="section-loader">
      <div className="mini-spinner"></div>
      <p>{message}</p>
    </div>
  );
}
