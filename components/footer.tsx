export function Footer() {
    return (
        <footer className="border-t border-border py-12 bg-background">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <p className="text-sm text-muted-foreground">
                    © 2026 Shubham Jadhav. All rights reserved.
                </p>
                <div className="flex items-center gap-6">
                    <a
                        href="https://github.com/5hu6h4m"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        GitHub
                    </a>
                </div>
            </div>
        </footer>
    )
}
