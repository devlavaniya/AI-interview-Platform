import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  ChevronRight,
  Code2,
  Database,
  ExternalLink,
  Globe,
  Layers3,
  Search,
  Server,
  Terminal,
  Trophy,
  X,
} from "lucide-react";

function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const resources = [
    {
      id: 1,
      title: "LeetCode",
      description:
        "Practice coding problems, algorithms and interview questions with problems across different difficulty levels.",
      category: "DSA",
      type: "Practice",
      level: "All Levels",
      icon: Brain,
      accent: "orange",
      url: "https://leetcode.com/",
      featured: true,
    },

    {
      id: 2,
      title: "CP-Algorithms",
      description:
        "A strong reference for algorithms and competitive programming techniques, including graphs, strings, math and data structures.",
      category: "DSA",
      type: "Reference",
      level: "Intermediate",
      icon: Code2,
      accent: "yellow",
      url: "https://cp-algorithms.com/",
    },

    {
      id: 3,
      title: "Tech Interview Handbook",
      description:
        "Curated technical interview preparation covering algorithms, coding interviews, behavioral interviews and more.",
      category: "Interview",
      type: "Interview Prep",
      level: "Intermediate",
      icon: BriefcaseBusiness,
      accent: "blue",
      url: "https://www.techinterviewhandbook.org/",
      featured: true,
    },

    {
      id: 4,
      title: "MDN Web Docs",
      description:
        "Learn HTML, CSS, JavaScript, Web APIs and modern web development through structured documentation and tutorials.",
      category: "Web Development",
      type: "Learning",
      level: "Beginner",
      icon: Globe,
      accent: "blue",
      url: "https://developer.mozilla.org/en-US/docs/Learn_web_development",
      featured: true,
    },

    {
      id: 5,
      title: "freeCodeCamp",
      description:
        "Free interactive programming lessons, projects and certifications covering web development and programming.",
      category: "Web Development",
      type: "Interactive",
      level: "Beginner",
      icon: Code2,
      accent: "purple",
      url: "https://www.freecodecamp.org/learn/",
    },

    {
      id: 6,
      title: "The Odin Project",
      description:
        "A project-based curriculum for learning full-stack web development by actually building applications.",
      category: "Web Development",
      type: "Project Based",
      level: "Beginner",
      icon: Layers3,
      accent: "red",
      url: "https://www.theodinproject.com/",
    },

    {
      id: 7,
      title: "React Documentation",
      description:
        "The official React learning material covering components, state, effects, hooks and modern React development.",
      category: "React",
      type: "Documentation",
      level: "Intermediate",
      icon: Code2,
      accent: "cyan",
      url: "https://react.dev/learn",
      featured: true,
    },

    {
      id: 8,
      title: "Node.js Documentation",
      description:
        "Official documentation for Node.js APIs, runtime concepts, modules, streams and server-side JavaScript.",
      category: "Backend",
      type: "Documentation",
      level: "Intermediate",
      icon: Server,
      accent: "green",
      url: "https://nodejs.org/docs/latest/api/",
    },

    {
      id: 9,
      title: "FastAPI Documentation",
      description:
        "Learn how to build modern, fast Python APIs with FastAPI, validation, dependency injection and automatic documentation.",
      category: "Backend",
      type: "Documentation",
      level: "Intermediate",
      icon: Server,
      accent: "green",
      url: "https://fastapi.tiangolo.com/",
    },

    {
      id: 10,
      title: "PostgreSQL Documentation",
      description:
        "Official PostgreSQL documentation covering SQL, queries, indexes, transactions, performance and database administration.",
      category: "Database",
      type: "Reference",
      level: "Intermediate",
      icon: Database,
      accent: "blue",
      url: "https://www.postgresql.org/docs/",
    },

    {
      id: 11,
      title: "MongoDB University",
      description:
        "Learn MongoDB through courses covering database fundamentals, aggregation, data modeling and application development.",
      category: "Database",
      type: "Learning",
      level: "Beginner",
      icon: Database,
      accent: "green",
      url: "https://learn.mongodb.com/",
    },

    {
      id: 12,
      title: "System Design Primer",
      description:
        "A large collection of system design concepts, scalability patterns, architectures and interview questions.",
      category: "System Design",
      type: "Interview Prep",
      level: "Advanced",
      icon: Layers3,
      accent: "yellow",
      url: "https://github.com/donnemartin/system-design-primer",
      featured: true,
    },

    {
      id: 13,
      title: "System Design Interview",
      description:
        "Explore distributed systems concepts, scalability, databases, caching, queues and architecture patterns.",
      category: "System Design",
      type: "Reference",
      level: "Advanced",
      icon: Server,
      accent: "purple",
      url: "https://github.com/donnemartin/system-design-primer",
    },

    {
      id: 14,
      title: "Git Documentation",
      description:
        "Learn Git fundamentals, branching, merging, rebasing, collaboration and version control workflows.",
      category: "Developer Tools",
      type: "Documentation",
      level: "Beginner",
      icon: Terminal,
      accent: "orange",
      url: "https://git-scm.com/doc",
    },

    {
      id: 15,
      title: "GitHub Skills",
      description:
        "Interactive exercises for learning GitHub workflows, Actions, collaboration and development practices.",
      category: "Developer Tools",
      type: "Interactive",
      level: "Beginner",
      icon: Terminal,
      accent: "purple",
      url: "https://skills.github.com/",
    },

    {
      id: 16,
      title: "Tech Interview Handbook",
      description:
        "Practical interview preparation with coding patterns, behavioral questions, resume advice and interview strategies.",
      category: "Interview",
      type: "Interview Prep",
      level: "All Levels",
      icon: Trophy,
      accent: "yellow",
      url: "https://www.techinterviewhandbook.org/",
    },
  ];

  const categories = [
    "All",
    "DSA",
    "Web Development",
    "React",
    "Backend",
    "Database",
    "System Design",
    "Interview",
    "Developer Tools",
  ];

  const filteredResources = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesCategory =
        activeCategory === "All" || resource.category === activeCategory;

      const matchesSearch =
        !query ||
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.category.toLowerCase().includes(query) ||
        resource.type.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const featuredResources = resources.filter((resource) => resource.featured);

  const getAccentClasses = (accent) => {
    const styles = {
      yellow: {
        icon: "bg-yellow-400/10 text-yellow-400",
        border: "hover:border-yellow-400/30",
        badge: "bg-yellow-400/10 text-yellow-400",
      },

      blue: {
        icon: "bg-blue-400/10 text-blue-400",
        border: "hover:border-blue-400/30",
        badge: "bg-blue-400/10 text-blue-400",
      },

      green: {
        icon: "bg-emerald-400/10 text-emerald-400",
        border: "hover:border-emerald-400/30",
        badge: "bg-emerald-400/10 text-emerald-400",
      },

      orange: {
        icon: "bg-orange-400/10 text-orange-400",
        border: "hover:border-orange-400/30",
        badge: "bg-orange-400/10 text-orange-400",
      },

      purple: {
        icon: "bg-purple-400/10 text-purple-400",
        border: "hover:border-purple-400/30",
        badge: "bg-purple-400/10 text-purple-400",
      },

      cyan: {
        icon: "bg-cyan-400/10 text-cyan-400",
        border: "hover:border-cyan-400/30",
        badge: "bg-cyan-400/10 text-cyan-400",
      },

      red: {
        icon: "bg-red-400/10 text-red-400",
        border: "hover:border-red-400/30",
        badge: "bg-red-400/10 text-red-400",
      },
    };

    return styles[accent] || styles.yellow;
  };

  return (
    <div className="min-h-full bg-[#090909] text-white">
      {/* HEADER */}

      <div className="border-b border-zinc-800">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-[11px] font-medium text-yellow-400">
                  Learning Hub
                </span>

                <span className="text-xs text-zinc-600">
                  {resources.length} curated resources
                </span>
              </div>

              <span className="block text-3xl font-bold tracking-tight text-white">
                Learn. Practice. Build.
              </span>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                Carefully selected resources for DSA, development, system design
                and technical interviews.
              </p>
            </div>

            {/* SEARCH */}

            <div className="relative w-full lg:w-80">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
              />

              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search resources..."
                className="
                  h-10
                  w-full
                  rounded-xl
                  border
                  border-zinc-800
                  bg-[#111111]
                  pl-10
                  pr-10
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-zinc-600
                  focus:border-yellow-400/40
                "
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-zinc-600
                    hover:text-white
                  "
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* CATEGORY FILTERS */}

        <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
          {categories.map((category) => {
            const active = activeCategory === category;

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`
                  whitespace-nowrap
                  rounded-lg
                  px-3
                  py-2
                  text-xs
                  font-medium
                  transition
                  ${
                    active
                      ? "bg-yellow-400 text-black"
                      : "border border-zinc-800 bg-[#111111] text-zinc-500 hover:border-zinc-700 hover:text-white"
                  }
                `}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* FEATURED */}

        {activeCategory === "All" && !searchQuery && (
          <section className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-white">
                  Recommended
                </span>

                <p className="mt-1 text-xs text-zinc-600">
                  Start here if you don't know what to learn next.
                </p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {featuredResources.slice(0, 3).map((resource) => {
                const Icon = resource.icon;
                const accent = getAccentClasses(resource.accent);

                return (
                  <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      group
                      rounded-2xl
                      border
                      border-zinc-800
                      bg-[#111111]
                      p-5
                      transition-all
                      hover:-translate-y-0.5
                      ${accent.border}
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className={`
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          ${accent.icon}
                        `}
                      >
                        <Icon size={19} />
                      </div>

                      <ArrowUpRight
                        size={17}
                        className="
                          text-zinc-700
                          transition
                          group-hover:text-yellow-400
                        "
                      />
                    </div>

                    <span
                      className={`
                        mt-5
                        inline-flex
                        rounded-md
                        px-2
                        py-1
                        text-[10px]
                        font-medium
                        ${accent.badge}
                      `}
                    >
                      {resource.category}
                    </span>

                    <span className="mt-3 block text-base font-semibold text-white">
                      {resource.title}
                    </span>

                    <p className="mt-2 line-clamp-3 text-xs leading-5 text-zinc-500">
                      {resource.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-[11px] text-zinc-600">
                        {resource.type}
                      </span>

                      <span className="flex items-center gap-1 text-[11px] font-medium text-zinc-500 group-hover:text-yellow-400">
                        Open
                        <ChevronRight size={13} />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* RESOURCE HEADER */}

        <div className="mb-5 flex items-end justify-between">
          <div>
            <span className="text-sm font-semibold text-white">
              {activeCategory === "All" ? "All Resources" : activeCategory}
            </span>

            <p className="mt-1 text-xs text-zinc-600">
              {filteredResources.length} resources available
            </p>
          </div>
        </div>

        {/* RESOURCE GRID */}

        {filteredResources.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredResources.map((resource) => {
              const Icon = resource.icon;
              const accent = getAccentClasses(resource.accent);

              return (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    group
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-[#111111]
                    p-5
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-[#141414]
                    ${accent.border}
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        ${accent.icon}
                      `}
                    >
                      <Icon size={17} />
                    </div>

                    <ExternalLink
                      size={15}
                      className="
                        text-zinc-700
                        transition
                        group-hover:text-zinc-400
                      "
                    />
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <span
                      className={`
                        rounded-md
                        px-2
                        py-1
                        text-[10px]
                        font-medium
                        ${accent.badge}
                      `}
                    >
                      {resource.category}
                    </span>

                    <span className="text-[10px] text-zinc-600">
                      {resource.level}
                    </span>
                  </div>

                  <span className="mt-3 block text-sm font-semibold text-zinc-100">
                    {resource.title}
                  </span>

                  <p className="mt-2 line-clamp-3 text-xs leading-5 text-zinc-500">
                    {resource.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-zinc-800 pt-4">
                    <span className="text-[11px] text-zinc-600">
                      {resource.type}
                    </span>

                    <span className="flex items-center gap-1 text-[11px] font-medium text-zinc-500 transition group-hover:text-yellow-400">
                      Explore
                      <ChevronRight size={13} />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-[#111111] px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900">
              <BookOpen className="h-5 w-5 text-zinc-600" />
            </div>

            <span className="mt-4 block text-sm font-medium text-white">
              No resources found
            </span>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-zinc-600">
              Try a different search term or select another category.
            </p>

            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="
                mt-5
                rounded-lg
                bg-yellow-400
                px-4
                py-2
                text-xs
                font-semibold
                text-black
                transition
                hover:bg-yellow-300
              "
            >
              Clear filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default ResourcesPage;
