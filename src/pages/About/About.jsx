import React from 'react';
import PageHeading from '../../components/PageHeading';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';

const About = () => {
  return (
    <section className='mt-4 mb-10 bg-white rounded-2xl p-6 md:p-10 lg:p-20'>
      <PageHeading
        title="About Us"
        description="Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time."
      />
      <div className='min-h-60'>
        <Tabs>
          <TabList className="flex space-x-4 flex-wrap space-y-4 border-b-0 mb-6">
            <Tab
              className="px-3 text-lg cursor-pointer focus:outline-none hover:text-[#5B6A2E]"
              selectedClassName="text-[#5B6A2E] font-bold"
            >
              Story
            </Tab>
            <Tab
              className="px-3 text-lg cursor-pointer focus:outline-none hover:text-[#5B6A2E]"
              selectedClassName="text-[#5B6A2E] font-bold"
            >
              Mission
            </Tab>
            <Tab
              className="px-3 text-lg cursor-pointer focus:outline-none hover:text-[#5B6A2E]"
              selectedClassName="text-[#5B6A2E] font-bold"
            >
              Success
            </Tab>
            <Tab
              className="px-3 text-lg cursor-pointer focus:outline-none hover:text-[#5B6A2E]"
              selectedClassName="text-[#5B6A2E] font-bold"
            >
              Terms & Others
            </Tab>
          </TabList>

          <TabPanel>
            <div className='pl-3 space-y-4'>
              <p>
                Our story began with a simple idea and a strong vision: to create solutions that make a real difference in people’s lives. From the very beginning, we faced challenges that tested our resolve, but each obstacle taught us lessons and helped shape the company we are today. With dedication, creativity, and perseverance, we transformed our small initiative into a growing organization that values innovation and quality.
              </p>
              <p>
                Along the way, we built a culture rooted in collaboration, integrity, and continuous learning. Every milestone, big or small, represents not just business growth but also the meaningful relationships we’ve nurtured with our customers, partners, and communities. Our story is one of passion, resilience, and the unwavering belief that small ideas can lead to extraordinary outcomes.
              </p>
            </div>
          </TabPanel>
          <TabPanel>
            <div className='pl-3 space-y-4'>
              <p>Our mission is to empower communities and individuals by delivering innovative, reliable, and impactful solutions. We strive to understand the evolving needs of those we serve and create products and services that make a positive difference in their lives. Innovation, ethics, and efficiency guide our every action, ensuring that we provide solutions that are both effective and sustainable.</p>

              <p>Beyond business objectives, our mission is centered on building trust and credibility. By prioritizing quality, responsibility, and customer satisfaction, we aim to foster long-term relationships that extend beyond transactions. Every decision we make aligns with our goal of delivering value, promoting growth, and creating a lasting, positive impact on society.</p>

            </div>
          </TabPanel>
          <TabPanel>
            <div className='pl-3 space-y-4'>
              <h2>
                <p>
                  Success, for us, is measured not only in achievements but also in the meaningful impact we make. Every milestone we reach reflects our commitment to excellence, creativity, and persistence. Through dedication and strategic planning, we have built solutions that meet the needs of our clients, enhance communities, and set industry standards.
                </p>
                <p>
                  Our success stories are a testament to teamwork, innovation, and consistency. While growth is important, we believe true success lies in the value we create for people and the trust we earn. By celebrating our accomplishments and learning from our experiences, we continue to push boundaries, improve our offerings, and ensure that every achievement contributes to a larger purpose.
                </p>
              </h2>
            </div>
          </TabPanel>
          <TabPanel>
            <div className='pl-3 space-y-4'><p>
              This section provides important information about our policies, terms of service, and other guidelines to ensure transparency and clarity. Understanding these terms allows for smooth interactions and helps maintain trust between our organization and the people we serve. It explains responsibilities, rights, and procedures for engagement, support, and dispute resolution.
            </p>
              <p>
                By following these guidelines, you can confidently navigate our services while knowing your interests are protected. These terms reflect our commitment to ethical practices, accountability, and professional integrity. Ultimately, they are designed to foster strong, long-lasting relationships with clients, partners, and the wider community, ensuring that every interaction is fair, clear, and reliable.
              </p>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </section >
  );
};

export default About;