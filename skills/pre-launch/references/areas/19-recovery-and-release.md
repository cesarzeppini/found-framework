# 19 Recovery and release (V)

- **Backups on, and restored once** into a scratch project, with the time it took written down. Backups sit outside the reach of the tools and agents that work on the database. `[all]` Dashboard.
- **Point-in-time recovery** decided for production. `[all]` Dashboard.
- **Staging is separate from production:** own database, own payment test mode, own keys. `[all]`
- **Database changes are in version control,** production's migration history matches, and the schema rebuilds from the files. `[all]` Prove: rebuild the schema from the files and compare with production's.
- **A rollback plan** for the website, the functions, the database and the jobs. `[all]`
- **A one-page runbook:** who is called, first five minutes, how to roll back, how to restore. `[all]`
- **Deploys are repeatable:** CI, or written-down commands. `[all]`
