const Header = ({ head1, head2, paragraph, classStyle = "" }) => {
  return (
    <header className={`text-center mb-5 ${classStyle}`} id="section-header">
      <h2 className="display-5 fw-semibold text-uppercase">
        <span className="text-secondary">{head1}</span>{" "}
        <span className="text-dark">{head2}</span>
      </h2>
      {paragraph && (
        <p className="text-muted small mt-2 mx-auto" style={{ maxWidth: "600px" }}>
          {paragraph}
        </p>
      )}
    </header>
  );
};

export default Header;
