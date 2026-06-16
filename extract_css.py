import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Match the <style>...</style> block
match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
if match:
    style_content = match.group(1).strip()
    
    # Write to styles.css
    with open('styles.css', 'w', encoding='utf-8') as f:
        f.write(style_content + '\n')
        
    # Replace in index.html
    new_content = content.replace(match.group(0), '<link rel="stylesheet" href="styles.css" />')
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("Successfully extracted CSS and updated index.html")
else:
    print("Could not find <style> block")
