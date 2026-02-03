import { Helmet } from "react-helmet";
import React from "react";
import { SEOConfig, organizationSchema, serviceSchema, localBusinessSchema } from "../config/seoConfig";

interface SEOHeadProps {
  config: Partial<SEOConfig>;
  includeSchemas?: boolean;
}

/**
 * SEO Head Component
 * Manages all meta tags, Open Graph, Twitter Cards, and structured data
 */
const SEOHead: React.FC<SEOHeadProps> = ({ config, includeSchemas = false }) => {
  const {
    title,
    description,
    keywords = [],
    url,
    image,
    locale = "en_US",
    type = "website",
  } = config;

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        {title && <title>{title}</title>}
        {description && <meta name="description" content={description} />}
        {keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
        
        {/* Canonical URL */}
        {url && <link rel="canonical" href={url} />}
        
        {/* Open Graph Meta Tags (Facebook, LinkedIn) */}
        {title && <meta property="og:title" content={title} />}
        {description && <meta property="og:description" content={description} />}
        {type && <meta property="og:type" content={type} />}
        {url && <meta property="og:url" content={url} />}
        {image && <meta property="og:image" content={image} />}
        {locale && <meta property="og:locale" content={locale} />}
        <meta property="og:site_name" content="EITO Group" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        {title && <meta name="twitter:title" content={title} />}
        {description && <meta name="twitter:description" content={description} />}
        {image && <meta name="twitter:image" content={image} />}
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="google" content="notranslate" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Geo Tags for Local SEO */}
        <meta name="geo.region" content="MY-14" />
        <meta name="geo.placename" content="Kuala Lumpur" />
        <meta name="geo.position" content="3.139003;101.686855" />
        <meta name="ICBM" content="3.139003, 101.686855" />
      </Helmet>
      
      {/* Structured Data (JSON-LD) - Outside Helmet to avoid Symbol errors */}
      {includeSchemas && (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        </>
      )}
    </>
  );
};

export default SEOHead;
