const Header = ({ head1, head2, paragraph, classStyle = "", filter}) => {
  return (
    <header className={`text-center mb-5 ${classStyle}`} id="section-header">
      <h2 className="display-5 fw-semibold text-uppercase" style={{ fontSize: "28px", letterSpacing: "2px", fontWeight: "400" }}>
        <span className="text-dark">{head1}</span>{" "}
        <span className="text-dark">{head2}</span>
      </h2>
      {paragraph && (
        <p className="text-muted small mt-2 mx-auto" style={{ maxWidth: "600px", fontSize: "13px" }}>
          {paragraph}
        </p>
      )}
      {filter && (<span className="text-muted small mx-auto" style={{ maxWidth: "600px", fontSize: "13px" }}>{filter} items</span>)}
    </header>
  );
};

export default Header;
