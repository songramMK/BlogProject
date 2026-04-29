 **DASHBOARD CREATE**
- useLocation: এটি react-router-dom এর একটি হুক। এটি বর্তমান URL-এর তথ্য (যেমন: pathname, search query) আমাদের প্রদান করে।

- useEffect: সাইড-ইফেক্ট ম্যানেজ করার জন্য

const location = useLocation();
এটার মানে কী?

*location.search: এটি URL-এর সেই অংশটি ধরে যা ? দিয়ে শুরু হয়। উদাহরণস্বরূপ: যদি লিঙ্কটি হয় example.com/dashboard?tab=profile, তবে location.search হবে ?tab=profile ।*

<br>

ধরি আমার  browser এর URL হলো:

http://localhost:5173/dashboard?tab=profile
useLocation() এই পুরো URL-এর info নিয়ে আসে।

যার ভেতরে থাকে : 
1. pathname
2. search (মানে ?tab=profile)
3. hash ইত্যাদি



- URLSearchParams: এটি একটি জাভাস্ক্রিপ্ট অবজেক্ট যা কুয়েরি স্ট্রিং থেকে নির্দিষ্ট মান খুঁজে বের করতে সাহায্য করে।

- urlParams.get('tab'): এটি ?tab=... এর পরের মানটি (যেমন 'profile' বা 'settings') উদ্ধার করে।

- Dependency Array [location.search]: এর মানে হলো, যখনই URL-এর কুয়েরি প্যারামিটার পরিবর্তন হবে, তখনই এই useEffect আবার রান করবে।
