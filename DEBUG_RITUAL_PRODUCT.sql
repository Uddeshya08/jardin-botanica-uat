-- ============================================
-- DEBUG: Ritual Product Not Showing in API
-- ============================================

-- 1. Check product basic info
SELECT 
    id,
    title,
    handle,
    status,
    created_at
FROM public.product
WHERE id = 'prod_01K777P8B14KKXQPYYEQEN19ZZ';

-- Expected: status should be 'published'


-- 2. Check if product has variants
SELECT 
    pv.id as variant_id,
    pv.title as variant_title,
    pv.product_id,
    p.title as product_title
FROM public.product_variant pv
JOIN public.product p ON p.id = pv.product_id
WHERE p.id = 'prod_01K777P8B14KKXQPYYEQEN19ZZ';

-- Expected: At least 1 variant should exist


-- 3. Check product sales channel association (IMPORTANT!)
SELECT 
    p.id as product_id,
    p.title,
    psc.sales_channel_id,
    sc.name as channel_name
FROM public.product p
LEFT JOIN public.product_sales_channel psc ON p.id = psc.product_id
LEFT JOIN public.sales_channel sc ON sc.id = psc.sales_channel_id
WHERE p.id = 'prod_01K777P8B14KKXQPYYEQEN19ZZ';

-- Expected: Should have sales_channel_id
-- If NULL, product won't show in API!


-- 4. If sales channel is missing, check what sales channels exist
SELECT id, name, description, created_at
FROM public.sales_channel
ORDER BY created_at;


-- 5. Check main product's sales channel (for comparison)
SELECT 
    p.id as product_id,
    p.title,
    psc.sales_channel_id,
    sc.name as channel_name
FROM public.product p
LEFT JOIN public.product_sales_channel psc ON p.id = psc.product_id
LEFT JOIN public.sales_channel sc ON sc.id = psc.sales_channel_id
WHERE p.metadata->>'ritualProduct' = 'prod_01K777P8B14KKXQPYYEQEN19ZZ'
LIMIT 1;

-- This shows the main product's sales channel


-- ============================================
-- SOLUTIONS
-- ============================================

-- Solution 1: If product is not published
-- UPDATE public.product
-- SET status = 'published'
-- WHERE id = 'prod_01K777P8B14KKXQPYYEQEN19ZZ';


-- Solution 2: If sales channel is missing (MOST COMMON ISSUE!)
-- First, get the default sales channel ID:
-- SELECT id FROM public.sales_channel LIMIT 1;

-- Then link product to sales channel:
-- INSERT INTO public.product_sales_channel (product_id, sales_channel_id)
-- VALUES ('prod_01K777P8B14KKXQPYYEQEN19ZZ', 'YOUR_SALES_CHANNEL_ID')
-- ON CONFLICT DO NOTHING;


-- Solution 3: Copy sales channel from main product to ritual product
-- INSERT INTO public.product_sales_channel (product_id, sales_channel_id)
-- SELECT 
--     'prod_01K777P8B14KKXQPYYEQEN19ZZ',
--     psc.sales_channel_id
-- FROM public.product p
-- JOIN public.product_sales_channel psc ON p.id = psc.product_id
-- WHERE p.metadata->>'ritualProduct' = 'prod_01K777P8B14KKXQPYYEQEN19ZZ'
-- LIMIT 1
-- ON CONFLICT DO NOTHING;

