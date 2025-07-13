-- Example for the orders table
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_asset_id ON public.orders(asset_id);

-- Example for the enrollments table
CREATE INDEX idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON public.enrollments(course_id);