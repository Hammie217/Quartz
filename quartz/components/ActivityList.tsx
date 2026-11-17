import { QuartzComponentProps } from "./types"
import { activityGroup, collection, featuredItems } from "../util/publication"
import { ContentCard } from "./ContentCard"

export default function ActivityList({
  props,
  compact = false,
}: {
  props: QuartzComponentProps
  compact?: boolean
}) {
  const activities = collection(props.allFiles, "activity")
  if (!activities.length) return null
  if (compact)
    return (
      <section class="publication-section">
        <h2>Professional contributions</h2>
        <div class="publication-grid three">
          {featuredItems(activities, 3).map((file) => (
            <ContentCard file={file} props={props} />
          ))}
        </div>
      </section>
    )
  return (
    <>
      {[
        "Upcoming",
        "Past speaking",
        "Mentoring",
        "Ongoing involvement",
        "Other professional activity",
      ].map((group) => {
        const files = activities.filter((file) => activityGroup(file) === group)
        return files.length ? (
          <section class="publication-section">
            <h2>{group}</h2>
            <div class="publication-grid two">
              {files.map((file) => (
                <ContentCard file={file} props={props} />
              ))}
            </div>
          </section>
        ) : null
      })}
    </>
  )
}
