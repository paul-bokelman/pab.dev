import React from "react";
import type { NextPage, GetStaticProps } from "next";
import type { WritingPreview, Project } from "types";
import { getWritingPreviews, getProjects } from "lib/api";
import {
  PostPreview,
  ProjectPreview,
  Section,
  FadedFrame,
  Link,
  Entrance,
  EntranceItem,
  TextReveal,
  Underline,
  FontSwap,
  useSound,
} from "components";

interface Props {
  posts: Array<WritingPreview>;
  projects: Array<Project>;
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: { posts: getWritingPreviews(), projects: getProjects() },
  };
};

/** reads as a word in the sentence, behaves like a control */
const SoundToggle: React.FC = () => {
  const { muted, toggle } = useSound();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={!muted}
      className="link-default focus-outline-tight inline border-none bg-transparent p-0 align-baseline font-[inherit] text-[length:inherit] active:brightness-75"
    >
      {muted ? "turn it back on" : "turn that off"}
    </button>
  );
};

const Index: NextPage<Props> = ({ posts, projects }) => {
  return (
    <Entrance className="flex w-full flex-col gap-8 sm:gap-12">
      <EntranceItem>
        <section className="flex w-full flex-col gap-6">
          <div className="flex flex-col justify-center gap-4">
            <h1>hi, i&apos;m paul bokelman</h1>
            <FontSwap
              text="i think about thinking machines"
              className="-mt-4 mb-2 block font-mono text-sm leading-none tracking-[-0.0125em] text-muted"
            />
          </div>

          <p>
            i study computer science, mostly because it kept turning out to be the shortest path to everything else i
            wanted to understand. what actually holds my attention is{" "}
            <Underline delay={900}>the seam where psychology, biology, and computation meet</Underline>, where the same
            handful of ideas keep showing up wearing different notation and pretending not to know each other
          </p>
          <p>
            physics, mathematics, and philosophy get a fair share of the remaining hours, usually at the point where
            they stop behaving like separate subjects. i learn something, then build something to find out whether i
            actually learned it, which is slower than reading and considerably harder to fool
          </p>
          <p>
            if you look closely enough, though, most of this amounts to rearranging text in a few files until the
            computer stops complaining, and then writing down why it ever complained in the first place
          </p>
        </section>
      </EntranceItem>

      <EntranceItem>
        <Section
          title="things i built"
          description="projects i finished, or at least stopped working on, which for these purposes counts as the same thing"
        >
          <FadedFrame>
            <ul className="grid gap-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectPreview key={project.slug} {...project} />
              ))}
            </ul>
          </FadedFrame>
        </Section>
      </EntranceItem>

      <EntranceItem>
        <Section
          title="recently written"
          description="notes i mostly wrote to find out whether i understood the thing at all, then kept because deleting them felt worse"
        >
          <FadedFrame>
            {posts.length === 0 ? (
              <p className="p-4 text-sm text-gray-600">
                nothing here yet, which is either a scheduling problem or a nerve problem
              </p>
            ) : (
              <ul className="grid gap-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <PostPreview key={post.slug} {...post} />
                ))}
              </ul>
            )}
          </FadedFrame>
        </Section>
      </EntranceItem>

      <EntranceItem>
        <section className="flex w-full flex-col gap-10">
          <p className="text-sm text-muted">
            the two halves overlap more than that makes them sound. something i pick up in a class turns into a project
            because building it is the only way i find out what i missed, and{" "}
            <Underline delay={600} color="rgba(186, 150, 89, 0.32)">
              a project turns into writing for the same reason
            </Underline>
            . most of it ends up on <Link href="https://github.com/paul-bokelman">github</Link>, the rest gets said
            badly on <Link href="https://twitter.com/paul_bokelman">twitter</Link>. this page also makes a small amount
            of noise, and you can <SoundToggle /> whenever you like
          </p>

          <TextReveal
            text="you scrolled all the way down here, which is already more attention than this page was built to expect"
            sound="pencil"
            className="block text-pretty text-center font-handwritten text-2xl/8 tracking-tight text-gray-500 xl:px-8 xl:text-3xl/10"
          />
        </section>
      </EntranceItem>
    </Entrance>
  );
};

export default Index;
