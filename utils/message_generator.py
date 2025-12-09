"""
Message Generator Module
Generates personalized volunteer recruitment emails using templates.
"""


class MessageGenerator:
    """Generate personalized recruitment emails for HOPE Tutoring volunteers."""
    
    # Template categories for organization
    TEMPLATE_CATEGORIES = {
        'initial': {
            'name': '📨 Initial Outreach',
            'description': 'First-time contact templates'
        },
        'followup': {
            'name': '🔄 Follow-Up',
            'description': 'For volunteers who haven\'t responded'
        },
        'seasonal': {
            'name': '🎉 Seasonal',
            'description': 'Holiday and event-themed templates'
        }
    }
    
    # Pre-defined email templates
    TEMPLATES = {
        # ============================================
        # INITIAL OUTREACH TEMPLATES
        # ============================================
        'general': {
            'name': 'General Recruitment',
            'category': 'initial',
            'description': 'A warm, welcoming invitation to volunteer',
            'subject': 'Make a Difference with HOPE Tutoring - Volunteer Today!',
            'body': """Dear {first_name},

We hope this message finds you well! We're reaching out because we believe you could make an incredible impact in the lives of students in the Arlington, TX community.

HOPE Tutoring is a nonprofit organization dedicated to empowering 2nd-8th graders to reach their full academic potential through FREE, customized tutoring. Our mission is simple but powerful: every child deserves a chance to succeed.

Why Volunteer with HOPE?

• Make a real difference in a student's life through 1-on-1 tutoring
• Flexible scheduling that works with your availability
• Both in-person and virtual tutoring options
• Training and ongoing support provided
• Be part of a caring community of volunteers
• Monthly appreciation events to celebrate your impact

As a volunteer tutor, you'll help students build confidence, develop essential skills, and discover their love of learning. Many of our tutors say the experience is just as rewarding for them as it is for the students!

We'd love to have you join our team of dedicated volunteers. To learn more or sign up, please visit our website at https://www.hopetutoring.org/

Together, we can light the fire of education in young minds.

With gratitude,
The HOPE Tutoring Team

"Education is not the filling of a pail, but the lighting of a fire." — William Butler Yeats"""
        },
        
        'student_focused': {
            'name': 'Student-Focused',
            'category': 'initial',
            'description': 'Emphasizes the tutor-student relationship and impact',
            'subject': 'A Student is Waiting for YOU - Become a HOPE Tutor',
            'body': """Dear {first_name},

Right now, there's a student in Arlington who's struggling with their homework, feeling frustrated, and wondering if they'll ever "get it." That student is waiting for someone like YOU.

At HOPE Tutoring, we connect volunteer tutors with 2nd-8th grade students who need extra support in Math and Reading. Our approach is simple: one caring adult, one eager student, and the time to make learning click.

Here's what our parents say:

"In the little time my child has been with HOPE, he often tells me how he connects with his tutor. She helps him in understanding reading and the language arts." — Parent of a Sixth Grader

When you volunteer with HOPE, you're not just teaching math problems or reading passages — you're:

• Building a meaningful relationship with a young person
• Boosting their confidence and self-esteem
• Showing them that someone believes in their potential
• Creating memories that last a lifetime

Our students come from diverse backgrounds, many from low-income families and Title-1 schools. Your time and attention could be the difference between a student who gives up and one who thrives.

No teaching experience required — just patience, encouragement, and a genuine desire to help. We provide all the training and materials you need.

Ready to meet your student? Visit https://www.hopetutoring.org/ to get started.

One hour a week. One student's future. One incredible opportunity.

Warmly,
The HOPE Tutoring Team"""
        },
        
        'professional': {
            'name': 'Professional Appeal',
            'category': 'initial',
            'description': 'Tailored for working professionals',
            'subject': 'Use Your Skills to Transform a Student\'s Future',
            'body': """Dear {first_name},

As a professional, you've developed valuable skills and knowledge throughout your career. What if you could use those abilities to change a young person's trajectory?

HOPE Tutoring invites you to make a meaningful impact in your community by volunteering as a tutor for students in grades 2-8. It's a flexible opportunity designed to fit into busy schedules like yours.

What We Offer:

• Flexible Scheduling: Choose times that work with your calendar
• Virtual Options: Tutor from anywhere — home, office, or on the go
• Structured Support: We provide training, curriculum guidance, and ongoing resources
• Professional Development: Enhance your communication, patience, and mentoring skills
• Networking: Connect with other community-minded professionals

What You'll Give:

• 1-2 hours per week of focused tutoring time
• Your expertise and problem-solving abilities
• Encouragement and belief in a student's potential
• A role model for academic and professional success

Many of our professional volunteers tell us that tutoring provides a refreshing break from their daily routines while giving them a sense of purpose beyond their careers.

HOPE Tutoring serves students in the Arlington, TX area, prioritizing those from low-income families who might not otherwise have access to academic support.

Take the first step today. Learn more at https://www.hopetutoring.org/

Invest an hour. Impact a lifetime.

Best regards,
The HOPE Tutoring Team"""
        },
        
        'community': {
            'name': 'Community Impact',
            'category': 'initial',
            'description': 'Highlights local Arlington community benefits',
            'subject': 'Arlington Needs You - Join HOPE Tutoring Today',
            'body': """Dear {first_name},

Arlington is our home, and its future depends on the success of our children. Right now, many students in our community are falling behind academically — but you can help change that.

HOPE Tutoring is a local nonprofit working to close the education gap for 2nd-8th graders right here in Arlington. We provide FREE tutoring to students who need it most, especially those in low-income families and Title-1 schools.

The Need is Real:

• Many Arlington students lack access to academic support outside school
• Educational disparities can impact a child's entire future
• Every child deserves an equal chance at success

The Solution is YOU:

By volunteering just 1-2 hours per week, you can:

✓ Help a local student master challenging concepts
✓ Build confidence that extends beyond the classroom
✓ Strengthen our Arlington community from the ground up
✓ Be part of a network of neighbors helping neighbors

Our Services Include:

• FREE 1-on-1 tutoring in Math and Reading
• In-person sessions at convenient Arlington locations
• Virtual tutoring options for flexibility
• FREE summer camps to prevent learning loss
• Parent Power Hours for family engagement

When you tutor with HOPE, you're not just helping one student — you're investing in the future of our entire community.

Join your Arlington neighbors in making a difference. Visit https://www.hopetutoring.org/ to sign up today.

Together, we can ensure every child in Arlington has the support they need to succeed.

For Arlington, with HOPE,
The HOPE Tutoring Team

Phone: 817-860-7757
Email: admin@hopetutoring.org"""
        },
        
        'college_student': {
            'name': 'College Student',
            'category': 'initial',
            'description': 'Targeted appeal for university students',
            'subject': 'College Students Needed — Tutor Kids & Build Your Resume!',
            'body': """Hey {first_name}!

Are you a college student looking for a meaningful way to spend a few hours each week? Want to build your resume while actually making a difference?

HOPE Tutoring is looking for college volunteers like you to tutor elementary and middle school students in Arlington.

Why college students LOVE volunteering with HOPE:

📝 Resume Builder: "Volunteer Tutor" looks great on grad school and job applications
⏰ Flexible Hours: We work around YOUR class schedule
🎓 Real Experience: Gain teaching, mentoring, and communication skills
💼 Service Hours: Perfect for honor societies, Greek life, or scholarship requirements
🚗 Convenient: Virtual tutoring means you can help from your dorm room!

What you'll do:
• Meet with a student 1-2 hours per week
• Help with Math and/or Reading (we provide all materials)
• Be a positive role model for a young person
• See real progress and impact

No teaching experience needed — just show up, be patient, and care. We handle the rest.

Sign up today: https://www.hopetutoring.org/

You're building your future — help a kid build theirs too!

Go make a difference,
The HOPE Tutoring Team

P.S. — We're especially looking for tutors who can help in the evenings. Perfect for after class!"""
        },
        
        'faith_based': {
            'name': 'Faith & Service',
            'category': 'initial',
            'description': 'Appeal to faith communities and service-minded individuals',
            'subject': 'Called to Serve? Help a Child Learn with HOPE Tutoring',
            'body': """Dear {first_name},

"Each of you should use whatever gift you have received to serve others." — 1 Peter 4:10

If you've ever felt called to serve your community in a meaningful way, we'd love to share an opportunity with you.

HOPE Tutoring is a faith-inspired nonprofit serving children in Arlington, TX. Since 2014, we've been living out our mission to empower young people through education — and we need caring volunteers like you.

Why This Matters:

Many of the students we serve come from families facing financial hardship. They attend under-resourced schools and don't have access to tutoring or academic support at home. For these children, a caring volunteer tutor can be life-changing.

How You Can Serve:

• Commit just 1-2 hours per week
• Tutor a student in Math or Reading (grades 2-8)
• Choose in-person sessions or virtual tutoring
• Receive full training and ongoing support

The Impact:

When you tutor with HOPE, you're not just teaching academics — you're showing a child that they matter. You're being a light in their life and demonstrating love through action.

"Let your light shine before others, that they may see your good deeds." — Matthew 5:16

If your heart is stirred to serve, we invite you to learn more and sign up at https://www.hopetutoring.org/

Be a blessing. Change a life.

With faith and hope,
The HOPE Tutoring Team

Phone: 817-860-7757 | admin@hopetutoring.org"""
        },

        # ============================================
        # FOLLOW-UP TEMPLATES
        # ============================================
        'followup_gentle': {
            'name': 'Gentle Reminder',
            'category': 'followup',
            'description': 'Friendly check-in for those who haven\'t responded',
            'subject': 'Still Thinking About Volunteering, {first_name}?',
            'body': """Hi {first_name},

I hope this message finds you well! I reached out recently about volunteering with HOPE Tutoring, and I wanted to follow up in case my email got lost in the shuffle.

I completely understand — life gets busy! But I wanted to make sure you had the chance to consider this opportunity, because I think you'd be a great fit.

Quick reminder of what HOPE Tutoring offers:

🎯 Flexible scheduling (you choose your hours)
🏠 In-person OR virtual tutoring options
📚 All training and materials provided
💙 A chance to truly change a student's life

We currently have students waiting for tutors, and even just one hour a week can make a huge difference in their academic journey.

If you have any questions or concerns holding you back, I'd be happy to chat! Just reply to this email or give us a call at 817-860-7757.

Ready to take the next step? Sign up at https://www.hopetutoring.org/

No pressure at all — but if this is something you're interested in, we'd love to have you!

Warmly,
The HOPE Tutoring Team"""
        },
        
        'followup_urgent': {
            'name': 'Urgent Need',
            'category': 'followup',
            'description': 'Emphasizes current volunteer shortage',
            'subject': 'We Need You, {first_name} — Students Are Waiting',
            'body': """Dear {first_name},

I'm reaching out again because we have an urgent need for volunteer tutors, and I believe you could make a real difference.

Right now, we have more students on our waitlist than available tutors. These are kids in Arlington who are eager to learn but don't have access to the academic support they need.

Here's the reality:
• Students are waiting weeks to be matched with a tutor
• Many come from families who can't afford private tutoring
• Without help now, they risk falling further behind

We need volunteers who can commit to just 1-2 hours per week. That's it.

You don't need teaching experience — just patience and a willingness to help. We provide everything else: training, curriculum, ongoing support, and a student who will be SO grateful for your time.

Can we count on you?

👉 Sign up today at https://www.hopetutoring.org/

If something is preventing you from volunteering, please let me know. I'd love to address any concerns or find a way to make it work.

Every student deserves a chance to succeed. With your help, we can make that happen.

With hope,
The HOPE Tutoring Team

P.S. — If volunteering isn't right for you at this time, would you consider sharing our information with someone who might be interested? Every referral helps!"""
        },
        
        'followup_lastchance': {
            'name': 'Final Follow-Up',
            'category': 'followup',
            'description': 'Last attempt before closing the loop',
            'subject': 'One Last Note, {first_name}',
            'body': """Hi {first_name},

I promise this is my last email about volunteering! 😊

I've reached out a couple of times about tutoring with HOPE, and I understand if now isn't the right time. Life has seasons, and volunteering needs to fit into yours.

I just wanted to leave you with this:

If you ever find yourself with a spare hour or two each week and wondering how to spend it meaningfully — we'll be here. HOPE Tutoring has been empowering Arlington students since 2014, and we're not going anywhere.

Here's what you can do:

✅ Ready now? Sign up at https://www.hopetutoring.org/
📋 Not ready yet? Save our info for later
📣 Know someone else? Forward this email to a friend

Whatever you decide, thank you for taking the time to read about HOPE. The fact that you're on this list means you have a heart for helping others, and that matters.

Wishing you all the best,
The HOPE Tutoring Team

HOPE Tutoring
📧 admin@hopetutoring.org
📞 817-860-7757
🌐 www.hopetutoring.org"""
        },
        
        'followup_question': {
            'name': 'Question-Based',
            'category': 'followup',
            'description': 'Asks a direct question to encourage response',
            'subject': 'Quick Question, {first_name}',
            'body': """Hi {first_name},

I wanted to reach out with a quick question:

What's holding you back from volunteering with HOPE Tutoring?

I ask because I know you signed up to learn more, and I want to make sure we're addressing any concerns you might have.

Is it:
• ⏰ Time? We only ask for 1-2 hours per week — you choose when
• 📚 Experience? No teaching background needed — we train you
• 📍 Location? We have multiple sites AND virtual options
• ❓ Something else? I'd genuinely love to know

Just hit reply and let me know. Even a one-word answer helps!

If you're ready to jump in, you can sign up here: https://www.hopetutoring.org/

Students are waiting, and I think you'd be a wonderful tutor. But I also respect your time and decision.

Looking forward to hearing from you,
The HOPE Tutoring Team"""
        },
        
        'followup_story': {
            'name': 'Success Story',
            'category': 'followup',
            'description': 'Shares a real student success story',
            'subject': 'Meet Maria — The Student You Could Help',
            'body': """Dear {first_name},

I wanted to share a quick story with you.

Maria was a 4th grader who came to HOPE Tutoring struggling with reading. She was two grade levels behind and had started to believe she just "wasn't smart."

Her tutor, a volunteer named James, met with her every Tuesday for one hour. He was patient. He celebrated small wins. He never gave up on her.

Six months later, Maria was reading at grade level. But more importantly? She believed in herself again.

At her last session, Maria gave James a handmade card that said: "Thank you for helping me be brave."

That's what ONE volunteer did with ONE hour a week.

{first_name}, there's a student out there right now who needs their own James. Their own tutor. Their own champion.

Could that be you?

👉 Sign up to volunteer: https://www.hopetutoring.org/

No teaching degree required. No special skills. Just patience, kindness, and a willingness to show up.

Be someone's reason to feel brave.

With hope,
The HOPE Tutoring Team

P.S. — Maria is now in 7th grade and still loves reading. Stories like hers happen every day at HOPE — and they start with volunteers like you."""
        },
        
        'followup_referral': {
            'name': 'Referral Request',
            'category': 'followup',
            'description': 'Asks for referrals if they can\'t volunteer',
            'subject': 'Know Someone Who\'d Be a Great Tutor?',
            'body': """Hi {first_name},

I've reached out a few times about volunteering with HOPE Tutoring, and I totally understand if it's not the right fit for you right now.

But I have a small favor to ask:

Do you know someone who might make a great volunteer tutor?

Maybe it's a:
• Friend who's great with kids
• Coworker looking for meaningful volunteer work
• Family member who loves helping others
• Neighbor who's retired and has time to give

We're always looking for caring people to join our team, and a personal recommendation goes a long way.

If someone comes to mind, just forward this email to them or share our website: https://www.hopetutoring.org/

And hey — if YOU ever decide the timing is right, the door is always open. We'd love to have you.

Thanks for taking a moment to think about this. It really does help!

Gratefully,
The HOPE Tutoring Team

P.S. — Every tutor makes a difference. One referral from you could change a student's life!"""
        },

        # ============================================
        # SEASONAL TEMPLATES
        # ============================================
        'seasonal_backtoschool': {
            'name': 'Back to School',
            'category': 'seasonal',
            'description': 'August/September new school year campaign',
            'subject': '🎒 New School Year, New Opportunity to Make a Difference!',
            'body': """Dear {first_name},

It's back-to-school season! As students across Arlington head back to the classroom, many are already feeling anxious about keeping up with their studies.

This is where YOU come in.

HOPE Tutoring is gearing up for the new school year, and we need volunteer tutors to help students start strong and stay on track.

Why volunteer this fall?

🍂 Perfect timing: Students benefit most from early intervention
📚 Fresh start: Be part of a student's back-to-school success story
🎯 New curriculum: Help students navigate new grade-level challenges
👥 Growing community: Join our fall cohort of dedicated volunteers

What we need:
• Tutors for Math and Reading (grades 2-8)
• Just 1-2 hours per week
• Available spots at multiple Arlington locations
• Virtual options also available!

This fall, you could be the reason a student goes from "I can't do this" to "I've got this!"

Sign up before the school year rush: https://www.hopetutoring.org/

Let's make this the best school year yet — for students AND volunteers!

With excitement,
The HOPE Tutoring Team

P.S. — Our fall orientation sessions are filling up fast. Sign up now to get trained and matched with a student by September!"""
        },
        
        'seasonal_thanksgiving': {
            'name': 'Thanksgiving Gratitude',
            'category': 'seasonal',
            'description': 'November gratitude and giving theme',
            'subject': '🦃 This Thanksgiving, Give the Gift of Learning',
            'body': """Dear {first_name},

As we enter the season of gratitude, we're reflecting on what we're thankful for at HOPE Tutoring:

💙 Our amazing volunteers who show up week after week
📖 The students who work so hard to improve
🏠 The Arlington community that supports our mission
🌟 People like you who care about education

This Thanksgiving, we invite you to give a gift that keeps on giving: your time.

Volunteering with HOPE Tutoring is one of the most meaningful ways to give back during the holiday season. While one hour of your time might seem small, to a struggling student, it's everything.

Imagine this:
A student who was failing math comes home with a B on their test — just in time to share the good news at Thanksgiving dinner. That could be YOUR impact.

Join us this season:

🍁 Sign up to volunteer: https://www.hopetutoring.org/
🍁 Training provided — no experience needed
🍁 Flexible scheduling around holiday plans
🍁 Start making a difference before the year ends

"Gratitude is not only the greatest of virtues but the parent of all others." — Cicero

Thank you for considering this opportunity. Whatever you decide, we wish you a warm and wonderful Thanksgiving!

With gratitude,
The HOPE Tutoring Team"""
        },
        
        'seasonal_newyear': {
            'name': 'New Year Resolution',
            'category': 'seasonal',
            'description': 'January fresh start and resolutions theme',
            'subject': '🎆 Make 2025 the Year You Change a Life',
            'body': """Dear {first_name},

Happy New Year! 🎉

As we step into a fresh year full of possibilities, many of us are thinking about resolutions. Gym memberships, new habits, personal goals...

But what if this year, you made a resolution that changes someone else's life?

Volunteering with HOPE Tutoring is a New Year's resolution that:

✅ Actually sticks (our volunteers love what they do!)
✅ Gives you purpose and fulfillment
✅ Makes a measurable difference in a child's life
✅ Connects you with an amazing community
✅ Only requires 1-2 hours per week

Here's the truth: Most resolutions fade by February. But when you commit to tutoring a student, you're making a promise that matters. You'll look forward to your sessions, and you'll see real progress.

Start the year with intention:

🎯 Sign up at https://www.hopetutoring.org/
📅 Choose a schedule that works for you
🎓 Get trained and matched with a student
💫 Make 2025 your most meaningful year yet

New year. New student. New impact.

Let's make this year count — together.

Cheers to a purposeful year ahead,
The HOPE Tutoring Team

P.S. — Our January orientation is coming up soon! Sign up now to start tutoring by the end of the month."""
        },
        
        'seasonal_spring': {
            'name': 'Spring Into Action',
            'category': 'seasonal',
            'description': 'Spring renewal and end-of-year push',
            'subject': '🌷 Spring Into Volunteering — Students Need Your Help!',
            'body': """Dear {first_name},

Spring is here! As flowers bloom and the weather warms up, it's the perfect time for new beginnings — including the beginning of your volunteer journey with HOPE Tutoring.

🌸 Why Spring is the BEST Time to Start:

• End-of-year crunch: Students need extra help preparing for final exams
• STAAR prep: Texas state testing is right around the corner
• Summer readiness: Help students avoid the "summer slide"
• Fresh energy: Warmer weather = happier tutoring sessions!

We currently have students who need support in:
📐 Math (all levels, grades 2-8)
📖 Reading and Language Arts
✏️ Homework help and study skills

The commitment is simple:
• 1-2 hours per week
• Your choice of location or virtual
• All training and materials provided
• A student who will be thrilled to meet you!

🌻 Don't let spring pass you by:
Sign up today at https://www.hopetutoring.org/

Help a student bloom this spring. Your time could be the sunshine they need to grow!

With spring wishes,
The HOPE Tutoring Team"""
        },
        
        'seasonal_summer': {
            'name': 'Summer Volunteer',
            'category': 'seasonal',
            'description': 'Summer break volunteering opportunity',
            'subject': '☀️ Make This Summer Count — Volunteer with HOPE!',
            'body': """Dear {first_name},

Summer break is almost here! While students are excited for vacation, research shows that many lose 2-3 months of learning over the summer — especially those from low-income families.

This is called the "summer slide," and it's real.

But YOU can help stop it.

HOPE Tutoring runs summer programs specifically designed to keep students engaged and learning during the break. And we need volunteers like you to make it happen!

🌴 Summer Volunteering Perks:

• More flexible than the school year — perfect for summer schedules!
• Fun, relaxed atmosphere (learning doesn't have to be boring)
• Make a huge impact in preventing learning loss
• Great for students, teachers, or anyone with summer availability
• Options for in-person and virtual tutoring

🏖️ What We Need:

• Tutors available 1-2 hours per week (even just a few weeks helps!)
• Enthusiasm and patience (no teaching degree required)
• A desire to make a difference

Don't let summer be a setback for Arlington students. Be part of the solution!

Sign up for summer tutoring: https://www.hopetutoring.org/

Let's make this a summer to remember — for you AND for a student who needs you.

Sunny regards,
The HOPE Tutoring Team

P.S. — Our summer program spots fill up fast! Sign up now to secure your place."""
        },
        
        'seasonal_christmas': {
            'name': 'Holiday Giving',
            'category': 'seasonal',
            'description': 'December holiday season giving theme',
            'subject': '🎄 Give the Gift of Education This Holiday Season',
            'body': """Dear {first_name},

The holiday season is here — a time for giving, gratitude, and making memories with loved ones.

This year, what if you gave a gift that doesn't come in a box?

At HOPE Tutoring, we believe one of the greatest gifts you can give is your time. And for a student who's struggling in school, the gift of a caring tutor can change everything.

🎁 The Gift of Your Time:

• Just 1-2 hours per week
• Help a student in Math or Reading
• See their confidence grow
• Create a connection that lasts beyond the holidays

Imagine a child opening their report card in January and seeing improvement. Imagine them smiling because someone believed in them. That could be YOUR impact.

'Tis the season to give:

🌟 Sign up to volunteer: https://www.hopetutoring.org/
🌟 Training provided — start in January
🌟 Flexible scheduling around the holidays

"The best way to spread Christmas cheer is helping others throughout the year."

Thank you for considering this opportunity. However you choose to give this season, we wish you warmth, joy, and peace.

Happy Holidays,
The HOPE Tutoring Team

🎄 www.hopetutoring.org | 817-860-7757"""
        },
        
        'seasonal_valentines': {
            'name': 'Valentine\'s Day',
            'category': 'seasonal',
            'description': 'February love and caring theme',
            'subject': '💙 Share the Love — Become a HOPE Tutor!',
            'body': """Dear {first_name},

February is the month of love — and at HOPE Tutoring, we're all about spreading love through education!

What if this Valentine's Day, you showed love to a student who needs it most?

Many children in Arlington don't have someone to help them with homework. They don't have someone cheering them on when learning gets hard. But you could be that person.

💙 Ways to Show Love:

• Tutor a student 1-2 hours per week
• Celebrate their small wins
• Be patient when they struggle
• Believe in them when they doubt themselves

It's not about being perfect. It's about showing up, caring, and making a difference.

Here's the truth: Some kids have never had an adult outside their family invest time in them. You could be the first.

💝 Share the love: https://www.hopetutoring.org/

No experience needed — just a heart willing to help.

This Valentine's Day, give a gift that truly matters.

With love,
The HOPE Tutoring Team

P.S. — Love is a verb. Show it through action! 💙"""
        },
        
        'seasonal_mlk': {
            'name': 'MLK Day of Service',
            'category': 'seasonal',
            'description': 'Martin Luther King Jr. Day service theme',
            'subject': '✊ Honor MLK\'s Legacy — Volunteer with HOPE Tutoring',
            'body': """Dear {first_name},

"Life's most persistent and urgent question is: What are you doing for others?"
— Dr. Martin Luther King Jr.

As we celebrate MLK Day, we're reminded that service to others is at the heart of his legacy. Dr. King believed that education was the pathway to freedom — and that every child deserves access to it.

At HOPE Tutoring, we work to make that vision a reality.

📚 Our Mission:

We provide FREE tutoring to students in Arlington, TX — many from low-income families and under-resourced schools. We believe every child deserves an equal chance to succeed, regardless of their zip code or circumstances.

✊ How You Can Serve:

• Volunteer as a tutor 1-2 hours per week
• Help students in grades 2-8 with Math and Reading
• Be a mentor, role model, and champion for education equality
• Continue Dr. King's legacy of service and justice

"Education is the passport to the future, for tomorrow belongs to those who prepare for it today." — Malcolm X

Make this MLK Day more than just a day off. Make it a day ON — a day of service, commitment, and action.

Sign up to volunteer: https://www.hopetutoring.org/

Be the change. Honor the legacy. Serve others.

In solidarity,
The HOPE Tutoring Team"""
        },
        
        'seasonal_teacherappreciation': {
            'name': 'Teacher Appreciation',
            'category': 'seasonal',
            'description': 'May Teacher Appreciation Week theme',
            'subject': '🍎 Teachers Are Heroes — And We Need More Like You!',
            'body': """Dear {first_name},

May is Teacher Appreciation Month, and we're celebrating everyone who helps students learn — including our amazing volunteer tutors!

But here's the truth: Teachers can't do it alone.

Classrooms are crowded. Resources are stretched thin. Many students need more one-on-one support than teachers can provide. That's where HOPE Tutoring — and volunteers like you — come in.

🍎 Why Volunteer This Month:

• Support overworked teachers by helping their students outside the classroom
• Provide personalized attention that kids desperately need
• Be part of the education solution
• No teaching degree required — just patience and care

🏫 What Tutoring Looks Like:

• 1-2 hours per week (you choose when)
• Focus on Math or Reading for grades 2-8
• Training and materials provided
• In-person or virtual options

Teachers plant seeds. Tutors help them grow.

This Teacher Appreciation Month, honor educators by becoming one yourself — even if just for an hour a week.

Sign up today: https://www.hopetutoring.org/

Thank a teacher. Become a tutor.

With appreciation,
The HOPE Tutoring Team"""
        },
        
        'seasonal_graduation': {
            'name': 'Graduation Season',
            'category': 'seasonal',
            'description': 'May/June graduation and achievement theme',
            'subject': '🎓 Graduation Season — Help a Student Reach Theirs!',
            'body': """Dear {first_name},

It's graduation season! 🎓

Across the country, students are walking across stages, receiving diplomas, and celebrating years of hard work. It's a reminder that education changes lives.

But not every student gets there easily. Some are struggling right now — falling behind, losing confidence, wondering if they'll ever succeed.

That's where YOU come in.

At HOPE Tutoring, we help students build the foundation they need to reach their own graduation day. And we need volunteers to make it happen.

🎓 Your Impact:

• Help a 4th grader master multiplication — so they're ready for algebra later
• Help a 6th grader improve their reading — so they can tackle high school texts
• Help a student believe in themselves — so they never give up

Every graduation starts with someone who believed in that student. Could that person be you?

🎯 Sign up to tutor: https://www.hopetutoring.org/

Just 1-2 hours per week. A lifetime of impact.

Let's help more students reach their graduation day.

Proudly,
The HOPE Tutoring Team

P.S. — Summer is the perfect time to start! Sign up now and be matched with a student before fall."""
        }
    }
    
    @classmethod
    def get_available_templates(cls) -> list:
        """Get list of available templates with metadata."""
        return [
            {
                'id': template_id,
                'name': template['name'],
                'category': template.get('category', 'initial'),
                'description': template['description'],
                'subject': template['subject'],
                'body': template['body']
            }
            for template_id, template in cls.TEMPLATES.items()
        ]
    
    @classmethod
    def get_template_categories(cls) -> dict:
        """Get template category metadata."""
        return cls.TEMPLATE_CATEGORIES
    
    def generate_single(
        self,
        volunteer: dict,
        template_id: str = 'general',
        custom_subject: str = None,
        custom_body: str = None
    ) -> dict:
        """
        Generate a personalized email for a single volunteer.
        
        Args:
            volunteer: Dictionary with volunteer data (name, email, etc.)
            template_id: ID of template to use
            custom_subject: Custom subject line (optional)
            custom_body: Custom email body (optional)
            
        Returns:
            Dictionary with generated email
        """
        template = self.TEMPLATES.get(template_id, self.TEMPLATES['general'])
        
        # Use custom content if provided, otherwise use template
        subject = custom_subject if custom_subject else template['subject']
        body = custom_body if custom_body else template['body']
        
        # Prepare merge fields
        merge_fields = {
            'first_name': volunteer.get('first_name') or volunteer.get('name', '').split()[0] if volunteer.get('name') else 'Friend',
            'name': volunteer.get('name', ''),
            'email': volunteer.get('email', ''),
            'phone': volunteer.get('phone', ''),
            'interests': volunteer.get('interests', ''),
            'location': volunteer.get('location', 'Arlington')
        }
        
        # Default first_name if empty
        if not merge_fields['first_name']:
            merge_fields['first_name'] = 'Friend'
        
        # Apply merge fields
        personalized_subject = self._apply_merge_fields(subject, merge_fields)
        personalized_body = self._apply_merge_fields(body, merge_fields)
        
        return {
            'name': volunteer.get('name', ''),
            'email': volunteer.get('email', ''),
            'subject': personalized_subject,
            'body': personalized_body,
            'template_used': template_id
        }
    
    def generate_batch(
        self,
        volunteers: list,
        template_id: str = 'general',
        custom_subject: str = None,
        custom_body: str = None
    ) -> list:
        """
        Generate personalized emails for multiple volunteers.
        
        Args:
            volunteers: List of volunteer dictionaries
            template_id: ID of template to use
            custom_subject: Custom subject line (optional)
            custom_body: Custom email body (optional)
            
        Returns:
            List of generated email dictionaries
        """
        return [
            self.generate_single(volunteer, template_id, custom_subject, custom_body)
            for volunteer in volunteers
        ]
    
    def _apply_merge_fields(self, text: str, fields: dict) -> str:
        """Apply merge field substitutions to text."""
        result = text
        
        for field_name, value in fields.items():
            placeholder = '{' + field_name + '}'
            result = result.replace(placeholder, str(value) if value else '')
        
        return result
