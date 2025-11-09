-- Update marketplace data without re-creating schools
-- This script adds aircraft with school_id to the existing schools

-- First, delete all existing aircraft
DELETE FROM aircraft;

-- Insert aircraft for all schools with both tail_number (portal) and registration (marketplace)
INSERT INTO aircraft (id, school_id, tail_number, registration, make, model, year, category, hourly_rate, avionics, maintenance_status, total_hours, last_inspection, image_url, is_available) VALUES
-- Skyline Flight Academy (Phoenix)
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'N12345', 'N12345', 'Cessna', '172S Skyhawk', 2020, 'single_engine', 165.00, 'Garmin G1000', 'excellent', 1250.50, NOW() - INTERVAL '30 days', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0', true),
('a1111112-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'N67890', 'N67890', 'Piper', 'PA-28-181 Archer III', 2019, 'single_engine', 155.00, 'Garmin G430', 'excellent', 1580.25, NOW() - INTERVAL '15 days', 'https://images.unsplash.com/photo-1540962351504-03099e0a754b', true),
('a1111113-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'N24680', 'N24680', 'Cessna', '182T Skylane', 2021, 'single_engine', 195.00, 'Garmin G1000 NXi', 'excellent', 850.00, NOW() - INTERVAL '20 days', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0', true),
('a1111114-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'N13579', 'N13579', 'Diamond', 'DA40 NG', 2022, 'single_engine', 175.00, 'Garmin G1000 NXi', 'excellent', 450.75, NOW() - INTERVAL '10 days', 'https://images.unsplash.com/photo-1540962351504-03099e0a754b', true),

-- Golden Gate Aviation (San Francisco)
('a2222221-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'N11111', 'N11111', 'Cessna', '172N', 2018, 'single_engine', 145.00, 'Traditional Six-Pack', 'good', 3250.50, NOW() - INTERVAL '25 days', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0', true),
('a2222222-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'N22222', 'N22222', 'Piper', 'PA-28-161 Warrior', 2017, 'single_engine', 135.00, 'Garmin G430', 'good', 4100.25, NOW() - INTERVAL '18 days', 'https://images.unsplash.com/photo-1540962351504-03099e0a754b', true),
('a2222223-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'N33333', 'N33333', 'Cessna', '172S Skyhawk', 2021, 'single_engine', 170.00, 'Garmin G1000', 'excellent', 680.00, NOW() - INTERVAL '12 days', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0', true),

-- Lone Star Flight School (Austin)
('a3333331-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'N44444', 'N44444', 'Cessna', '172R Skyhawk', 2019, 'single_engine', 160.00, 'Garmin G1000', 'excellent', 1890.75, NOW() - INTERVAL '22 days', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0', true),
('a3333332-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'N55555', 'N55555', 'Piper', 'PA-28-181 Archer III', 2020, 'single_engine', 165.00, 'Garmin G650', 'excellent', 1120.50, NOW() - INTERVAL '14 days', 'https://images.unsplash.com/photo-1540962351504-03099e0a754b', true),
('a3333333-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'N66666', 'N66666', 'Cirrus', 'SR20', 2021, 'single_engine', 245.00, 'Garmin Perspective+', 'excellent', 550.25, NOW() - INTERVAL '8 days', 'https://images.unsplash.com/photo-1540962351504-03099e0a754b', true),

-- Sunshine Aviation (Miami)
('a4444441-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'N77777', 'N77777', 'Cessna', '172S Skyhawk', 2020, 'single_engine', 168.00, 'Garmin G1000', 'excellent', 1345.00, NOW() - INTERVAL '19 days', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0', true),
('a4444442-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'N88888', 'N88888', 'Piper', 'PA-44-180 Seminole', 2019, 'multi_engine', 285.00, 'Garmin G1000', 'excellent', 980.50, NOW() - INTERVAL '16 days', 'https://images.unsplash.com/photo-1540962351504-03099e0a754b', true),
('a4444443-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'N99999', 'N99999', 'Diamond', 'DA42 NG', 2021, 'multi_engine', 325.00, 'Garmin G1000 NXi', 'excellent', 450.25, NOW() - INTERVAL '11 days', 'https://images.unsplash.com/photo-1540962351504-03099e0a754b', true),

-- Windy City Flight Training (Chicago)
('a5555551-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'N10101', 'N10101', 'Cessna', '172N', 2016, 'single_engine', 140.00, 'Traditional Six-Pack', 'good', 5250.75, NOW() - INTERVAL '28 days', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0', true),
('a5555552-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'N20202', 'N20202', 'Piper', 'PA-28-161 Warrior', 2018, 'single_engine', 148.00, 'Garmin G430', 'good', 2890.50, NOW() - INTERVAL '21 days', 'https://images.unsplash.com/photo-1540962351504-03099e0a754b', true),
('a5555553-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'N30303', 'N30303', 'Cessna', '182T Skylane', 2020, 'single_engine', 190.00, 'Garmin G1000', 'excellent', 1120.25, NOW() - INTERVAL '13 days', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0', true),

-- Rocky Mountain Aero (Denver)
('a6666661-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 'N40404', 'N40404', 'Cessna', '172S Skyhawk', 2021, 'single_engine', 172.00, 'Garmin G1000 NXi', 'excellent', 780.50, NOW() - INTERVAL '17 days', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0', true),
('a6666662-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 'N50505', 'N50505', 'Piper', 'PA-28-181 Archer III', 2020, 'single_engine', 168.00, 'Garmin G650', 'excellent', 1050.75, NOW() - INTERVAL '14 days', 'https://images.unsplash.com/photo-1540962351504-03099e0a754b', true),
('a6666663-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 'N60606', 'N60606', 'Cessna', '182T Skylane', 2022, 'single_engine', 198.00, 'Garmin G1000 NXi', 'excellent', 320.25, NOW() - INTERVAL '9 days', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0', true),
('a6666664-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 'N70707', 'N70707', 'Diamond', 'DA40 NG', 2021, 'single_engine', 180.00, 'Garmin G1000 NXi', 'excellent', 650.50, NOW() - INTERVAL '12 days', 'https://images.unsplash.com/photo-1540962351504-03099e0a754b', true);

-- Success message
SELECT 'Aircraft data inserted successfully for all schools!' as message,
       (SELECT COUNT(*) FROM aircraft WHERE school_id IS NOT NULL) as aircraft_with_schools;
