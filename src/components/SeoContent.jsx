import { useLang } from '../lib/LangContext.jsx'
import { DISPLAY_BANDS } from '../lib/numerology.js'
import { STRINGS } from '../lib/i18n.js'
import { Verdict } from './Verdict.jsx'

// Static FAQPage structured data, always in English regardless of the UI
// language toggle — keeps it matching index.html's JSON-LD rather than
// flipping under crawlers as the visible copy below does.
const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: STRINGS.en.seo.faq.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export function SeoContent() {
  const { t, lang } = useLang()
  const seo = t('seo')

  return (
    <section aria-labelledby="about-heading" className="border-t border-border bg-background px-5 py-14 text-foreground md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <div>
          <h2 id="about-heading" className="text-[25px] font-extrabold leading-tight">
            {seo.whatIsHeading}
          </h2>
          <p className="mt-3 leading-relaxed text-muted">{seo.whatIsBody}</p>
        </div>

        <div>
          <h2 className="text-[25px] font-extrabold leading-tight">{seo.howHeading}</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-muted">
            {seo.howSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>

        <div>
          <h2 className="text-[25px] font-extrabold leading-tight">{seo.bandsHeading}</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-left text-[15px]">
              <caption className="sr-only">{seo.bandsHeading}</caption>
              <thead>
                <tr className="border-b border-border text-sm text-muted">
                  <th scope="col" className="py-2 pr-4 font-medium">
                    {lang === 'ta' ? 'பொருள்' : 'Verdict'}
                  </th>
                  <th scope="col" className="py-2 font-medium">
                    {lang === 'ta' ? 'அட்டவணைப் பெயர்' : 'Chart name'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {DISPLAY_BANDS.map((band) => (
                  <tr key={band.key} className="border-b border-border last:border-0">
                    <td className="py-2 pr-4">
                      <Verdict band={band} />
                    </td>
                    <td className="py-2 text-muted">{lang === 'ta' ? band.labelTa : band.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-[25px] font-extrabold leading-tight">{seo.faqHeading}</h2>
          <div className="mt-3 divide-y divide-border">
            {seo.faq.map((item) => (
              <details key={item.q} className="group py-3">
                <summary className="flex min-h-11 cursor-pointer items-center font-semibold">
                  {item.q}
                </summary>
                <p className="mt-2 leading-relaxed text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
    </section>
  )
}
