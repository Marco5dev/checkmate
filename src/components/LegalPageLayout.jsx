import { LEGAL_CONTENT } from "@/constants/legalContent";

export default function LegalPageLayout({ type = "terms" }) {
  const content = LEGAL_CONTENT[type];

  return (
    <div className="flex justify-center h-screen login-bg bg-cover bg-no-repeat bg-center w-screen">
      <div className="w-[95%] h-5/6 mt-24 flex">
        <div className="bg-base-300 w-full max-h-5/6 rounded-lg p-6 overflow-auto">
          {/* Main Title and Last Updated */}
          <h1 className="text-4xl font-bold mb-2 text-primary">
            {content.title}
          </h1>
          {content.lastUpdated && (
            <p className="text-sm text-base-content/70 mb-4">
              Last updated: {content.lastUpdated}
            </p>
          )}

          <div className="divider my-4"></div>

          {/* Sections */}
          <div className="space-y-8">
            {content.sections.map((section, index) => (
              <div key={index} className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">
                  {section.title}
                </h2>

                {section.content && (
                  <p className="text-lg mb-4 text-base-content leading-relaxed">
                    {section.content}
                  </p>
                )}

                {/* Subsections */}
                {section.subsections?.map((subsection, subIndex) => (
                  <div key={subIndex} className="ml-4 mb-4">
                    <h3 className="text-xl font-semibold mb-2 text-accent">
                      {subsection.title}
                    </h3>
                    {subsection.content && (
                      <p className="text-lg mb-2 text-base-content">
                        {subsection.content}
                      </p>
                    )}
                    {subsection.list && (
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        {subsection.list.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-base-content">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

                {/* Section List */}
                {section.list && (
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    {section.list.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="text-base-content text-lg leading-relaxed"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="divider my-4"></div>
          <div className="text-sm text-base-content/70">
            <p>
              Contact us at: <b>support@checkmate.marco5dev.me</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
