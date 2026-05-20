from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

output_path = Path(__file__).resolve().parent.parent / 'public' / 'images' / 'OIP (4).webp'
output_path.parent.mkdir(parents=True, exist_ok=True)

width, height = 1200, 1200
img = Image.new('RGBA', (width, height), '#f8fbff')
draw = ImageDraw.Draw(img)

# Draw background shapes
for i, col in enumerate(['#b7e4ff', '#90e0ef', '#48cae4']):
    draw.ellipse((width*0.05 + i*60, height*0.1 + i*50, width*0.75 + i*60, height*0.75 + i*50), fill=col)

# Draw main sachet shape
shape_color = '#e0f7ff'
outline_color = '#0b63a8'
poly = [(width*0.25, height*0.2), (width*0.75, height*0.2), (width*0.72, height*0.85), (width*0.28, height*0.85)]
draw.polygon(poly, fill=shape_color, outline=outline_color)
# top wave accent
draw.arc((width*0.27, height*0.15, width*0.73, height*0.55), start=180, end=360, fill='#38bdf8', width=24)

# Draw label area
label_box = (width*0.3, height*0.35, width*0.7, height*0.5)
draw.rectangle(label_box, fill='#ffffff', outline='#165d9c', width=4)

# Add Cool Pac text
try:
    font_big = ImageFont.truetype('arial.ttf', 120)
    font_small = ImageFont.truetype('arial.ttf', 48)
except Exception:
    font_big = ImageFont.load_default()
    font_small = ImageFont.load_default()

text = 'COOL'
text2 = 'Pac'
bbox = draw.textbbox((0, 0), text, font=font_big)
w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
draw.text(((width-w)/2, height*0.38 - h/2), text, fill='#0d4f8b', font=font_big)
bbox2 = draw.textbbox((0, 0), text2, font=font_small)
w2, h2 = bbox2[2] - bbox2[0], bbox2[3] - bbox2[1]
draw.text(((width-w2)/2, height*0.5 - h2/2), text2, fill='#ef476f', font=font_small)

# Add water droplet icon
drop_center = (width*0.6, height*0.7)
drop_size = 130
draw.polygon([
    (drop_center[0], drop_center[1]-drop_size*0.9),
    (drop_center[0]-drop_size*0.5, drop_center[1]+drop_size*0.3),
    (drop_center[0], drop_center[1]+drop_size*0.9),
    (drop_center[0]+drop_size*0.5, drop_center[1]+drop_size*0.3)
], fill='#45aaf2')

# Add tagline
tagline = 'Cool, clean & refreshing'
bbox3 = draw.textbbox((0, 0), tagline, font=font_small)
w3, h3 = bbox3[2] - bbox3[0], bbox3[3] - bbox3[1]
draw.text(((width-w3)/2, height*0.8), tagline, fill='#0a4e7c', font=font_small)

img.save(output_path, format='WEBP', quality=95, method=6)
print(f'Written {output_path}')
