#!/bin/bash

# EVVM Documentation Scraper
# Scrapes EVVM docs and generates llms.txt files

set -e

# Function to show menu
show_menu() {
    echo ""
    echo "Select an option:"
    echo ""
    echo "  1) Smart scrape (checks for changes first)"
    echo "  2) Force scrape (bypass change detection)"
    echo "  3) Re-add EIP-191 to existing llms-full.txt"
    echo "  4) Exit"
    echo ""
    read -p "Enter your choice [1-4]: " choice
}

# Function to run smart scrape (with change detection)
run_smart_scrape() {
    echo ""
    echo "Running smart scraper (checks for changes first)..."
    npm run scrape
}

# Function to run force scrape (bypass change detection)
run_force_scrape() {
    echo ""
    echo "Running force scraper (bypassing change detection)..."
    npm run scrape -- --force
}

# Function to add EIP-191
run_eip191() {
    echo ""
    echo "Adding EIP-191 content..."
    npm run add-eip191
}

# Main loop
while true; do
    show_menu

    case $choice in
        1)
            run_smart_scrape
            ;;
        2)
            run_force_scrape
            ;;
        3)
            run_eip191
            ;;
        4)
            echo ""
            echo "✨ Goodbye!"
            echo ""
            exit 0
            ;;
        *)
            echo ""
            echo "❌ Invalid option. Please select 1-4."
            ;;
    esac

    echo ""
    read -p "Press Enter to continue..."
done
