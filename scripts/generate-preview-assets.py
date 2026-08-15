#!/usr/bin/env python3
"""Generate the deterministic STIKMΛGIC launch asset set."""

from __future__ import annotations

import math
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "apps/web/public/previews"
SIZE, FRAMES, FPS = 512, 36, 18
FONT = "/System/Library/Fonts/Supplemental/Arial Black.ttf"


def build_backdrop() -> Image.Image:
    im = Image.new("RGBA", (SIZE, SIZE), "#060711")
    px = im.load()
    for y in range(SIZE):
        for x in range(SIZE):
            r = math.hypot(x - 256, y - 238) / 365
            px[x, y] = (int(10 + 17 * (1-r)), int(8 + 8 * (1-r)), int(24 + 30 * (1-r)), 255)
    return im


BACKDROP = build_backdrop()


def glow(base: Image.Image, layer: Image.Image, radius: int = 22) -> None:
    base.alpha_composite(layer.filter(ImageFilter.GaussianBlur(radius)))
    base.alpha_composite(layer.filter(ImageFilter.GaussianBlur(max(4, radius // 3))))
    base.alpha_composite(layer)


def canvas(alpha: bool = False) -> Image.Image:
    if alpha:
        return Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    return BACKDROP.copy()


def particles(im: Image.Image, t: float, seed: int = 0) -> None:
    d = ImageDraw.Draw(im)
    for i in range(12):
        a = i * 2.399 + seed
        r = 120 + (i % 4) * 32
        x = 256 + math.cos(a + t * math.tau) * r
        y = 256 + math.sin(a + t * math.tau) * r
        q = 2 + i % 3
        d.ellipse((x-q, y-q, x+q, y+q), fill=(123, 242, 255, 110))


def letter_frame(letter: str, t: float, magenta: bool = False) -> Image.Image:
    im = canvas(); particles(im, t, ord(letter))
    pulse = .88 + .12 * math.sin(t * math.tau)
    font = ImageFont.truetype(FONT, int(300 * pulse))
    layer = Image.new("RGBA", im.size); d = ImageDraw.Draw(layer)
    box = d.textbbox((0, 0), letter, font=font, stroke_width=5)
    x, y = (SIZE-(box[2]-box[0]))/2, (SIZE-(box[3]-box[1]))/2-box[1]-6
    color = (255, 68, 219, 255) if magenta else (91, 249, 255, 255)
    d.text((x, y), letter, font=font, fill=(5, 7, 18, 235), stroke_width=10, stroke_fill=color)
    d.text((x, y), letter, font=font, fill=(12, 10, 28, 245), stroke_width=2, stroke_fill=(255,255,255,245))
    glow(im, layer, 26)
    return im


def signal_frame(t: float) -> Image.Image:
    im = canvas(); layer = Image.new("RGBA", im.size); d = ImageDraw.Draw(layer)
    flash = max(0.15, math.sin(t * math.pi * 2) ** 8)
    pts = [(277,78),(168,274),(243,267),(209,434),(353,219),(277,225)]
    d.polygon(pts, fill=(255,255,255,255), outline=(116,245,255,255), width=8)
    for i in range(12):
        a=i*math.tau/12; r1=150; r2=180+50*flash
        d.line((256+math.cos(a)*r1,256+math.sin(a)*r1,256+math.cos(a)*r2,256+math.sin(a)*r2), fill=(214,77,255,int(220*flash)), width=5)
    glow(im, layer, int(18+30*flash)); return im


def waveform_frame(t: float) -> Image.Image:
    im=canvas(); layer=Image.new("RGBA", im.size); d=ImageDraw.Draw(layer)
    for i in range(25):
        x=56+i*17; beat=(math.sin((i*.52-t*math.tau*4))+1)/2
        h=28+155*beat*(.55+.45*math.sin(t*math.tau*4+i)**2)
        color=(100,245,255,235) if i%3 else (225,77,255,240)
        d.rounded_rectangle((x,256-h/2,x+8,256+h/2),radius=4,fill=color)
    glow(im,layer,18); return im


def cloud_frame(t: float) -> Image.Image:
    im=canvas(); layer=Image.new("RGBA", im.size); d=ImageDraw.Draw(layer)
    for i,(x,y,r) in enumerate([(108,290,75),(182,250,105),(279,276,125),(378,247,88),(426,304,65)]):
        dx=28*math.sin(t*math.tau+i*.7)
        d.ellipse((x+dx-r,y-r,x+dx+r,y+r),fill=(150+i*12,151,255,180))
    layer=layer.filter(ImageFilter.GaussianBlur(18)); im.alpha_composite(layer)
    sheen=Image.new("RGBA",im.size); sd=ImageDraw.Draw(sheen)
    sd.ellipse((80+100*t,180,330+100*t,350),fill=(126,247,255,55)); im.alpha_composite(sheen.filter(ImageFilter.GaussianBlur(28)))
    particles(im,t,4); return im


def corner_frame(t: float) -> Image.Image:
    im=canvas(True); layer=Image.new("RGBA",im.size); d=ImageDraw.Draw(layer)
    phase=t*math.tau
    # Architectural corner arcs create a premium broadcast frame without filling the scene.
    for inset, color, width, sweep in [
        (24,(105,246,255,210),5,1.0),
        (54,(229,72,255,175),3,.82),
        (88,(255,255,255,100),2,.64),
    ]:
        box=(SIZE-390-inset,SIZE-390-inset,SIZE+150-inset,SIZE+150-inset)
        start=190+18*math.sin(phase+sweep)
        d.arc(box,start=start,end=292,fill=color,width=width)
    # A comet travels into the corner, blooms, then disappears for a seamless loop.
    p=(t*1.18)%1
    angle=math.radians(205+72*p)
    radius=340*(1-p)+34
    hx=SIZE-26+math.cos(angle)*radius; hy=SIZE-26+math.sin(angle)*radius
    for trail in range(16,0,-1):
        q=max(0,p-trail*.012)
        a=math.radians(205+72*q); rr=340*(1-q)+34
        x=SIZE-26+math.cos(a)*rr; y=SIZE-26+math.sin(a)*rr
        alpha=int(210*(1-trail/17)); size=max(1,8-trail//2)
        d.ellipse((x-size,y-size,x+size,y+size),fill=(108,245,255,alpha))
    d.ellipse((hx-8,hy-8,hx+8,hy+8),fill=(255,255,255,245))
    # Starburst and orbiting dust around the anchor point.
    bloom=max(0,1-abs(p-.92)/.12)
    for i in range(18):
        a=i*math.tau/18+phase*.12; length=15+(i%4)*10+48*bloom
        x0=SIZE-27+math.cos(a)*13; y0=SIZE-27+math.sin(a)*13
        x1=SIZE-27+math.cos(a)*length; y1=SIZE-27+math.sin(a)*length
        col=(230,74,255,int(70+170*bloom)) if i%3==0 else (104,245,255,int(80+160*bloom))
        d.line((x0,y0,x1,y1),fill=col,width=2+(i%3==0))
    for i in range(12):
        a=i*2.19+phase*(.35+i%2*.12); r=70+(i%5)*28
        x=SIZE-28+math.cos(a)*r; y=SIZE-28+math.sin(a)*r
        q=2+i%3; d.ellipse((x-q,y-q,x+q,y+q),fill=(255,255,255,90+i*10))
    glow(im,layer,20); return im


def fire_frame(t: float) -> Image.Image:
    im=canvas(); layer=Image.new("RGBA",im.size); d=ImageDraw.Draw(layer)
    wob=18*math.sin(t*math.tau*3); squish=1+.06*math.sin(t*math.tau*2)
    outer=[(256,60+wob),(372,220),(337,407),(256,456),(153,400),(127,268),(203,159),(215,283)]
    d.polygon(outer,fill=(255,64,164,255))
    inner=[(261,183-wob*.3),(319,280),(298,389),(236,410),(184,347),(205,269),(233,320)]
    d.polygon(inner,fill=(255,203,76,255)); d.ellipse((222,316,284,399),fill=(255,248,207,255))
    glow(im,layer,int(24*squish)); return im


def arrow_frame(t: float) -> Image.Image:
    im=canvas(); layer=Image.new("RGBA",im.size); d=ImageDraw.Draw(layer)
    pulse=max(.2,math.sin(t*math.tau)**6)
    for i in range(3):
        x=77+i*82; a=int(90+165*((t*3-i*.22)%1)); col=(104,245,255,a) if i<2 else (232,72,255,a)
        d.line((x,180,x+100,256,x,332),fill=col,width=28,joint="curve")
    d.line((291,256,430,256),fill=(255,255,255,220),width=18)
    d.polygon([(430,256),(365,207),(365,305)],fill=(255,255,255,245))
    glow(im,layer,int(18+20*pulse)); return im


ALPHABET_ASSETS = {
    f"letter-{letter.lower()}-neon": (lambda t, glyph=letter, index=index: letter_frame(glyph, t, index % 2 == 1))
    for index, letter in enumerate("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
}

ASSETS = {
    **ALPHABET_ASSETS,
    "signal-flash-01": signal_frame,
    "waveform-loop-01": waveform_frame,
    "cloud-drift-01": cloud_frame,
    "overlay-corner-spark": corner_frame,
    "emoji-fire-reaction": fire_frame,
    "signal-arrow-01": arrow_frame,
}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, render in ASSETS.items():
        frames=[render(i/FRAMES) for i in range(FRAMES)]
        frames[0].save(OUT/f"{name}.gif",save_all=True,append_images=frames[1:],duration=1000//FPS,loop=0,disposal=2,optimize=True)
        with tempfile.TemporaryDirectory() as raw:
            rawp=Path(raw)
            for i,frame in enumerate(frames): frame.save(rawp/f"{i:03}.png")
            subprocess.run(["ffmpeg","-loglevel","error","-y","-framerate",str(FPS),"-i",str(rawp/"%03d.png"),"-c:v","libvpx-vp9","-pix_fmt","yuva420p" if name=="overlay-corner-spark" else "yuv420p","-b:v","0","-crf","32","-an",str(OUT/f"{name}.webm")],check=True)
        print(name)


if __name__ == "__main__": main()
