const SingleFeature = ({ img, classLayout, head, text }) => {
	return (
		<article
			className={`d-flex flex-column gap-2 align-items-center ${classLayout}`}
			data-aos="fade-up"
     data-aos-anchor-placement="center-center"
		>
			<img src={img} alt="Easy Exchange" className="col-1 col-lg-2" />
			<h4 className="mt-2 mb-0 fw-bold">{head}</h4>
			<p className="c-gray">{text}</p>
		</article>
	);
};

export default SingleFeature;
