import Section from "../ui/section";

const citations = [
  {
    href: "https://ieeexplore.ieee.org/document/10169703",
    text: "A. D. Murumkar, A. Singh, B. R. Chachar, P. D. Bagade and G. Zaware, 'Artificial Intelligence (AI) based Nutrition Advisorusing an App,' 2023 International Conference on Sustainable Computing and Smart Systems (ICSCSS), Coimbatore, India, 2023, pp. 586-590, doi: 10.1109/ICSCSS57650.2023.10169703. keywords: {Proteins;Schedules;Dairy products;Machine learning;Artificial intelligence;Diseases;AI (Artificial Intelligence);Diet Plan;Counselor;BMI (Body Mass Index);Dietitian;AI technology;Diet Evaluation;Intelligent Health Management;Smart Diet Plan},",
  },
  {
    href: "https://ieeexplore.ieee.org/document/10859953",
    text: "J. Kanjalkar, P. Kanjalkar, R. Khanke, R. Mane, K. Kharat and K. Kolhe, 'An AI-Driven Framework for Personalized Diet Generation and Nutrition Suggestions Using Machine Learning, Computer Vision and NLP,' 2024 International Conference on Integrated Intelligence and Communication Systems (ICIICS), Kalaburagi, India, 2024, pp. 1-9, doi: 10.1109/ICIICS63763.2024.10859953. keywords: {Photography;Computer vision;Wearable Health Monitoring Systems;Visualization;Web services;Real-time systems;Natural language processing;User experience;Satellite images;Allergies;VGG16;KNN;natural language processing;LLM3;deep learning},",
  },
  {
    href: "https://ieeexplore.ieee.org/document/10916135",
    text: "I. -C. Chang, N. M. Trang, K. Chang and K. Albert, 'Diet advisor: an image-based food intake analysis and meal recommendation system,' International Conference on Innovation, Communication and Engineering 2024 (ICICE 2024), Danang, Vietnam, 2024, pp. 37-39, doi: 10.1049/icp.2025.0183.",
  },
];

const Citations = () => {
  return (
    <Section id="citations" className="mb-16 px-6 md:px-0">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-neutral-800 dark:text-neutral-50 flex items-center justify-center">
        Citations
      </h2>
      <p className="text-center text-neutral-500 max-w-3xl mx-auto mb-12">
        This work is inspired by and builds upon recent advancements in
        personalized nutrition and intelligent health systems.
      </p>
      <div className="max-w-3xl mx-auto space-y-6 text-neutral-600 dark:text-white bg-white dark:bg-black p-8 rounded-lg border border-neutral-200 dark:border-neutral-800">
        {citations.map((citation, index) => (
          <div key={index}>
            <p>
              [{index + 1}]&nbsp;
              <a
                href={citation.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 dark:text-sky-300 hover:underline"
              >
                {citation.text}
              </a>
            </p>
            {index < citations.length - 1 && (
              <hr className="border-neutral-200 dark:border-neutral-800 mt-6" />
            )}
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Citations;
