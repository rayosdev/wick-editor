export class ProjectTracker {
  private activeProject: unknown;

  constructor(initialProject?: unknown) {
    this.activeProject = initialProject;
  }

  get(): unknown {
    return this.activeProject;
  }

  set(project: unknown): void {
    this.activeProject = project;
  }
}
