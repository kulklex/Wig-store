import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Accordion,
  ButtonGroup,
  Carousel,
  Spinner,
  Badge,
} from "react-bootstrap";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, closeCartDrawer } from "../redux/cartSlice";

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [product, setProduct] = useState(null);
  const [selectedTexture, setSelectedTexture] = useState(null);
  const [selectedLength, setSelectedLength] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load product:", err);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    dispatch(closeCartDrawer());
  }, [dispatch]);

  const textureVariantsMap = useMemo(() => {
    const map = {};
    product?.variants?.forEach((variant) => {
      const key = variant.texture.toLowerCase().replace(/\s+/g, "_");
      if (!map[key]) map[key] = [];
      map[key].push(variant);
    });
    return map;
  }, [product]);

  useEffect(() => {
    if (product?.variants?.length) {
      const defaultVariant =
        product.variants.find((v) => v.texture.toLowerCase() === "straight") ||
        product.variants[0];
      const normalized = defaultVariant.texture.toLowerCase().replace(/\s+/g, "_");
      setSelectedTexture(normalized);
    }
  }, [product]);

  useEffect(() => {
    if (selectedTexture && textureVariantsMap[selectedTexture]) {
      const textureVariants = textureVariantsMap[selectedTexture];
      const defaultVariant = textureVariants[0];
      setMainImage(defaultVariant.media);
      setSelectedLength(defaultVariant.length);
      setSelectedOrigin(defaultVariant.origin);
      setSelectedVariant(defaultVariant);
      setQuantity(1);
    }
  }, [selectedTexture, textureVariantsMap]);

  const handleLengthClick = (len) => {
    const matched = textureVariantsMap[selectedTexture]?.find(
      (v) => v.length === len
    );
    if (matched) {
      setSelectedLength(len);
      setSelectedOrigin(matched.origin);
      setSelectedVariant(matched);
      setMainImage(matched.media);
      setQuantity(1);
    }
  };

  const cartItem = cartItems.find((item) => item.variantId === selectedVariant?._id);
  const currentCartQty = cartItem?.cartQty || 0;
  const maxAvailableQty = selectedVariant ? selectedVariant.stock - currentCartQty : 0;

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    if (quantity > maxAvailableQty) {
      alert("Cannot add more than available stock.");
      return;
    }

    const newCartItem = {
      variantId: selectedVariant._id,
      productId: product._id,
      title: product.name,
      price: selectedVariant.price,
      media: selectedVariant.media,
      stock: selectedVariant.stock,
      texture: selectedVariant.texture,
      length: selectedVariant.length,
      origin: selectedVariant.origin,
      cartQty: quantity,
    };

    dispatch(addToCart(newCartItem));
    setQuantity(1);
  };

  if (loading || !product)
    return <Spinner animation="border" className="d-block mx-auto my-5" />;

  const uniqueTextures = [
    ...new Set(
      product.variants.map((v) => v.texture.toLowerCase().replace(/\s+/g, "_"))
    ),
  ];

  const availableLengths =
    textureVariantsMap[selectedTexture]?.map((v) => ({
      length: v.length,
      stock: v.stock,
    })) || [];

  const textureVariantImages = [
    ...new Set((textureVariantsMap[selectedTexture] || []).map((v) => v.media)),
  ];

  const allVariantImages = [...new Set(product.variants.map((v) => v.media))];

  return (
    <Container className="my-4">
      <Row>
        <Col lg={6} className="d-none d-lg-flex">
          <div className="d-flex me-3">
            <div
              className="d-flex flex-column align-items-center overflow-auto"
              style={{ maxHeight: "600px" }}
            >
              {textureVariantImages.map((img, idx) => (
                <img
                  key={`texture-img-${idx}`}
                  src={img}
                  alt={`texture-thumb-${idx}`}
                  className="img-thumbnail mb-2"
                  style={{ width: "80px", cursor: "pointer" }}
                  onClick={() => setMainImage(img)}
                />
              ))}
              {allVariantImages
                .filter((img) => !textureVariantImages.includes(img))
                .map((img, idx) => (
                  <img
                    key={`all-thumb-${idx}`}
                    src={img}
                    alt={`all-thumb-${idx}`}
                    className="img-thumbnail mb-2"
                    style={{ width: "80px", opacity: 0.5 }}
                  />
                ))}
            </div>

            <div className="flex-grow-1 d-flex justify-content-center align-items-center">
              <img src={mainImage} alt="Main product" className="img-fluid" />
            </div>
          </div>
        </Col>

        <Col xs={12} className="d-lg-none mb-4">
          <Carousel indicators={true} controls={false}>
            {textureVariantImages.map((img, idx) => (
              <Carousel.Item key={idx}>
                <img src={img} className="d-block w-100" alt={`slide-${idx}`} />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>

        <Col lg={6} className="">
          <h2 className="product-title">{product.name}</h2>
          <p className="product-price">£{selectedVariant?.price}</p>

          <h6>LENGTH</h6>
          <div className="d-flex flex-wrap mb-4 gap-2">
            {availableLengths.map(({ length, stock }) => (
              <Button
                variant={selectedLength === length ? "dark" : "outline-dark"}
                className="me-1 mb-2 px-2 rounded-none position-relative option-button"
                key={length}
                onClick={() => handleLengthClick(length)}
                disabled={stock === 0}
              >
                {length}
                {stock === 0 && (
                  <Badge
                    bg="danger"
                    pill
                    className="position-absolute top-0 start-100 translate-middle"
                  >
                    Out
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          <h6>TEXTURE <span className="text-warning">?</span></h6>
          <div className="d-flex flex-wrap mb-3">
            {uniqueTextures.map((texture) => (
              <Button
                variant={selectedTexture === texture ? "dark" : "outline-dark"}
                className="me-1 mb-2 option-button"
                key={texture}
                onClick={() => setSelectedTexture(texture)}
              >
                {texture.replace(/_/g, " ")}
              </Button>
            ))}
          </div>

          <h6>ORIGIN</h6>
          <p className="mb-3">{selectedOrigin}</p>

          <h6>QUANTITY</h6>
          <ButtonGroup className="mb-3">
            <Button
              variant="outline-dark"
              onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
            >
              −
            </Button>
            <Button variant="light" disabled>
              {quantity}
            </Button>
            <Button
              variant="outline-dark"
              onClick={() =>
                setQuantity((q) => (q < maxAvailableQty ? q + 1 : q))
              }
              disabled={quantity >= maxAvailableQty}
            >
              +
            </Button>
          </ButtonGroup>
          {selectedVariant?.stock > 0 && (
            <small className="text-muted ms-2">
               {maxAvailableQty} left in stock
            </small>
          )}

          <Button
            variant="dark"
            size="lg"
            className="w-100 mb-3"
            onClick={handleAddToCart}
            disabled={selectedVariant?.stock === 0 || maxAvailableQty === 0}
          >
            {selectedVariant?.stock === 0 ? "OUT OF STOCK" : "ADD TO CART"}
          </Button>

          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Description</Accordion.Header>
              <Accordion.Body>{product.description}</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Hair Textures + Origins</Accordion.Header>
              <Accordion.Body>
                Includes Peruvian, Brazilian, Indian textures in a variety of curls and waves.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Delivery Info</Accordion.Header>
              <Accordion.Body>
                Express worldwide shipping available. See checkout for rates.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductPage;
