require "date"

module IwaXiv
  class WorkPages < Jekyll::Generator
    def generate(site)
      locales = site.data.fetch("locales")
      works = site.data.fetch("works")
      ids = {}

      works.each do |work|
        id = work.fetch("id")
        date = Date.iso8601(work.fetch("published_on"))
        if !id.match?(/\A\d{4}\.\d{4}\z/) || !id.start_with?(date.strftime("%y%m."))
          raise Jekyll::Errors::FatalException, "Invalid IwaXiv ID #{id.inspect} for #{date}"
        end
        if ids.key?(id)
          raise Jekyll::Errors::FatalException, "Duplicate IwaXiv ID #{id}"
        end

        ids[id] = true
        locales.each do |language, locale|
          directory = "#{locale.fetch('archive_path').delete_prefix('/')}abs/#{id}"
          page = Jekyll::PageWithoutAFile.new(site, site.source, directory, "index.html")
          page.data.merge!(
            "layout" => "work",
            "lang" => language,
            "work" => work,
            "title" => work.fetch(language).fetch("title")
          )
          site.pages << page
        end
      end

      ordered_works = works.sort_by { |work| work.values_at("published_on", "id") }.reverse
      months = ordered_works.group_by { |work| work.fetch("published_on")[0, 7] }
      site.data["archive_months"] = months.transform_values do |month_works|
        month_works.group_by { |work| work.fetch("published_on") }
      end
    end
  end
end
