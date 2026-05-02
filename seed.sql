INSERT OR IGNORE INTO users (first_name, last_name, handle, bio, interest_note, avatar_bg, avatar_color)
VALUES
('Alex', 'Kowalski', '@alexk_builds', 'Restoration obsessive. Based in Warsaw. Air-cooled Porsche and vintage Italian projects.', 'Follows Porsche restoration creators', '#faeeda', '#854f0b'),
('Kenji', 'Nakamura', '@kenji_jdm', 'R34 and JDM tuner focused on track-ready street builds.', 'Trending in builds and JDM', '#e6f1fb', '#185fa5'),
('Shreya', 'Patel', '@shreya_ev', 'Writes deep dives on EV platforms, batteries, and performance tuning.', 'Into Porsche and EV', '#eeedfe', '#534ab7'),
('Dylan', 'Marsh', '@dylan_audi', 'Audi RS platform specialist. Shares practical tune and maintenance guides.', 'Trending in mods', '#e1f5ee', '#0f6e56'),
('Marco', 'Ricci', '@marco_classics', 'Italian classics collector documenting long-term restoration journeys.', 'Follows Alex K.', '#faeeda', '#854f0b');

INSERT OR IGNORE INTO posts (
	user_id,
	slug,
	title,
	category,
	excerpt,
	body,
	horsepower,
	torque,
	drivetrain,
	platform,
	likes,
	is_featured
)
VALUES
(
	(SELECT id FROM users WHERE handle = '@marco_classics'),
	'ferrari-275-restoration',
	'1967 Ferrari 275 GTB - Full Restoration',
	'Restoration',
	'A ground-up restoration diary focused on bodywork, trim, and period-correct mechanical work.',
	'This build started as a rough but complete 275 GTB shell. We stripped to bare metal, corrected prior filler-heavy repairs, and mapped every panel gap before paint prep. The drivetrain was rebuilt in parallel, and each subsystem was documented to keep provenance clean for future owners.',
	'300 hp',
	'294 lb-ft',
	'RWD',
	'Vintage GT',
	2400,
	1
),
(
	(SELECT id FROM users WHERE handle = '@alexk_builds'),
	'porsche-911-rsr-repaint',
	'Bare-Metal Repaint on a 1973 Porsche 911 RSR',
	'Restoration',
	'Panel alignment, paint chemistry, and period-correct finish decisions.',
	'The shell was media-blasted and sealed in epoxy before any filler work. We corrected previous quarter panel distortion and reworked door skins to recover factory lines. The color match used archived swatches and iterative spray-outs under controlled lighting.',
	'330 hp',
	'260 lb-ft',
	'RWD',
	'Air-Cooled',
	3100,
	0
),
(
	(SELECT id FROM users WHERE handle = '@kenji_jdm'),
	'r34-widebody-track-build',
	'Widebody R34 Skyline - Track Build Breakdown',
	'Build',
	'A practical look at aero, brakes, and suspension setup for repeatable lap times.',
	'We moved from street compromise to track-first geometry with revised roll center correction and cooling duct optimization. Aero balance changed dramatically after splitter and wing revisions, requiring fresh damper tuning and corner weighting.',
	'620 hp',
	'510 lb-ft',
	'AWD',
	'JDM Turbo',
	8200,
	0
),
(
	(SELECT id FROM users WHERE handle = '@dylan_audi'),
	'audi-rs3-stage3-notes',
	'Stage 3 on the 2023 Audi RS3 - What Holds Up',
	'Mods',
	'Reliability notes after 10k km with upgraded turbo and fueling.',
	'This write-up covers thermal behavior, DSG adaptation strategy, and maintenance intervals that changed after moving to Stage 3 power levels. The key takeaway is managing intake air temps and gearbox service cadence to preserve consistency.',
	'560 hp',
	'490 lb-ft',
	'AWD',
	'MQB Evo',
	990,
	0
),
(
	(SELECT id FROM users WHERE handle = '@shreya_ev'),
	'taycan-performance-pack-analysis',
	'Taycan Performance Pack - Real Gains or Hype?',
	'Review',
	'Data-driven analysis of lap consistency and thermal limits.',
	'Using repeated session logs, we compared pre- and post-pack behavior under similar ambient conditions. Peak numbers matter less than sustained output, and the upgraded cooling strategy delivered the biggest practical benefit.',
	'750 hp',
	'774 lb-ft',
	'AWD',
	'EV Performance',
	1800,
	0
);

INSERT OR IGNORE INTO comments (post_id, user_id, comment_text)
VALUES
(
	(SELECT id FROM posts WHERE slug = 'porsche-911-rsr-repaint'),
	(SELECT id FROM users WHERE handle = '@kenji_jdm'),
	'Panel line consistency is excellent. Curious how you handled heat cycles before final clear.'
),
(
	(SELECT id FROM posts WHERE slug = 'porsche-911-rsr-repaint'),
	(SELECT id FROM users WHERE handle = '@dylan_audi'),
	'Great process notes. The spray-out workflow is especially helpful.'
),
(
	(SELECT id FROM posts WHERE slug = 'ferrari-275-restoration'),
	(SELECT id FROM users WHERE handle = '@alexk_builds'),
	'This is one of the cleanest documentation threads I have seen this year.'
);

INSERT OR IGNORE INTO follows (follower_user_id, followed_user_id)
VALUES
(
	(SELECT id FROM users WHERE handle = '@alexk_builds'),
	(SELECT id FROM users WHERE handle = '@marco_classics')
),
(
	(SELECT id FROM users WHERE handle = '@alexk_builds'),
	(SELECT id FROM users WHERE handle = '@kenji_jdm')
),
(
	(SELECT id FROM users WHERE handle = '@alexk_builds'),
	(SELECT id FROM users WHERE handle = '@shreya_ev')
),
(
	(SELECT id FROM users WHERE handle = '@kenji_jdm'),
	(SELECT id FROM users WHERE handle = '@dylan_audi')
),
(
	(SELECT id FROM users WHERE handle = '@shreya_ev'),
	(SELECT id FROM users WHERE handle = '@alexk_builds')
);

INSERT OR IGNORE INTO garage_cars (user_id, car_year, car_model, status)
VALUES
(
	(SELECT id FROM users WHERE handle = '@alexk_builds'),
	1973,
	'Porsche 911 RSR',
	'Paint booth final pass'
),
(
	(SELECT id FROM users WHERE handle = '@alexk_builds'),
	1992,
	'Lancia Delta Integrale',
	'Awaiting drivetrain refresh'
),
(
	(SELECT id FROM users WHERE handle = '@marco_classics'),
	1967,
	'Ferrari 275 GTB',
	'Assembly and detailing'
),
(
	(SELECT id FROM users WHERE handle = '@kenji_jdm'),
	1999,
	'Nissan Skyline GT-R R34',
	'Track setup validation'
);
