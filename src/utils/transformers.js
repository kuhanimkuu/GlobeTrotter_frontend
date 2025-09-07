export const transformTourPackage = (apiData) => {
  return {
    id: apiData.id,
    title: apiData.title,
    slug: apiData.slug,
    summary: apiData.summary,
    description: apiData.description,
    price: apiData.base_price,
    currency: apiData.currency,
    duration: apiData.duration_days,
    maxCapacity: apiData.max_capacity,
    destination: apiData.destination,
    images: apiData.images,
    mainImage: apiData.main_image_url,
    isActive: apiData.is_active,
    inclusions: apiData.inclusions,
    exclusions: apiData.exclusions,
    createdAt: apiData.created_at,
    updatedAt: apiData.updated_at
  };
};

export const transformUser = (apiData) => {
  return {
    id: apiData.id,
    username: apiData.username,
    email: apiData.email,
    firstName: apiData.first_name,
    lastName: apiData.last_name,
    fullName: `${apiData.first_name} ${apiData.last_name}`.trim() || apiData.username,
    phone: apiData.phone,
    company: apiData.company,
    role: apiData.role,
    avatar: apiData.avatar_url,
    isStaff: apiData.is_staff
  };
};

export const transformBooking = (apiData) => {
  return {
    id: apiData.id,
    status: apiData.status,
    total: apiData.total,
    currency: apiData.currency,
    createdAt: apiData.created_at,
    user: apiData.user ? transformUser(apiData.user) : null,
    items: apiData.items || [],
    package: apiData.package ? transformTourPackage(apiData.package) : null
  };
};

export const transformDestination = (apiData) => {
  return {
    id: apiData.id,
    name: apiData.name,
    country: apiData.country,
    city: apiData.city,
    slug: apiData.slug,
    shortDescription: apiData.short_description,
    description: apiData.description,
    latitude: apiData.latitude,
    longitude: apiData.longitude,
    coverImage: apiData.cover_image_url
  };
};