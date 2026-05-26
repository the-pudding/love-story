#!/usr/bin/env python3
"""
Resize transparent PNG images in the 'leftovers' directory with options
for preserving quality.

Usage examples:
    python resize_pngs.py --width 512 --height 512
    python resize_pngs.py --width 512                  # height auto from aspect ratio
    python resize_pngs.py --max-side 1024              # fit within a box, keep aspect
    python resize_pngs.py --width 512 --height 512 --fit pad   # letterbox with transparency
    python resize_pngs.py --width 512 --height 512 --fit crop  # center-crop to fill
    python resize_pngs.py --width 512 --resample lanczos --optimize
"""

import argparse
import sys
from pathlib import Path
from PIL import Image, ImageOps

# High-quality resampling filters. LANCZOS is generally best for downscaling.
RESAMPLE_FILTERS = {
    "lanczos": Image.Resampling.LANCZOS,   # best for downscaling, sharpest
    "bicubic": Image.Resampling.BICUBIC,   # smooth, good general purpose
    "bilinear": Image.Resampling.BILINEAR, # faster, softer
    "nearest": Image.Resampling.NEAREST,   # pixel art / preserves hard edges
    "hamming": Image.Resampling.HAMMING,   # decent for downscaling, faster than lanczos
}


def compute_size(orig_w, orig_h, target_w, target_h, max_side, fit):
    """Compute the output (width, height) and the size to resize the source to.

    Returns (canvas_size, resize_size) where:
      - canvas_size is the final image dimensions
      - resize_size is what we resize the source image to before pasting/cropping
    """
    # Mode 1: max-side -- fit within a square box, preserve aspect ratio
    if max_side is not None:
        scale = min(max_side / orig_w, max_side / orig_h, 1.0) if max_side else 1.0
        # Allow upscaling too if user explicitly sets max-side larger than image
        scale = min(max_side / orig_w, max_side / orig_h)
        new_w = max(1, round(orig_w * scale))
        new_h = max(1, round(orig_h * scale))
        return (new_w, new_h), (new_w, new_h)

    # Mode 2: only width given -- scale height by aspect ratio
    if target_w is not None and target_h is None:
        scale = target_w / orig_w
        new_h = max(1, round(orig_h * scale))
        return (target_w, new_h), (target_w, new_h)

    # Mode 3: only height given -- scale width by aspect ratio
    if target_h is not None and target_w is None:
        scale = target_h / orig_h
        new_w = max(1, round(orig_w * scale))
        return (new_w, target_h), (new_w, target_h)

    # Mode 4: both width and height given -- behavior depends on --fit
    if fit == "stretch":
        # Ignore aspect ratio, fill exactly. May distort.
        return (target_w, target_h), (target_w, target_h)

    if fit == "pad":
        # Fit entire image inside target box, pad with transparency.
        scale = min(target_w / orig_w, target_h / orig_h)
        new_w = max(1, round(orig_w * scale))
        new_h = max(1, round(orig_h * scale))
        return (target_w, target_h), (new_w, new_h)

    if fit == "crop":
        # Fill target box, cropping overflow from the center.
        scale = max(target_w / orig_w, target_h / orig_h)
        new_w = max(1, round(orig_w * scale))
        new_h = max(1, round(orig_h * scale))
        return (target_w, target_h), (new_w, new_h)

    raise ValueError(f"Unknown fit mode: {fit}")


def resize_image(src_path, dst_path, args, resample):
    with Image.open(src_path) as im:
        # Ensure RGBA so transparency is preserved
        if im.mode != "RGBA":
            im = im.convert("RGBA")

        orig_w, orig_h = im.size
        (canvas_w, canvas_h), (resize_w, resize_h) = compute_size(
            orig_w, orig_h, args.width, args.height, args.max_side, args.fit
        )

        # Skip if no work to do and not forced
        if (canvas_w, canvas_h) == (orig_w, orig_h) and not args.force:
            return "skipped (already target size)"

        resized = im.resize((resize_w, resize_h), resample=resample)

        if (resize_w, resize_h) == (canvas_w, canvas_h):
            out = resized
        elif args.fit == "pad":
            # Transparent canvas, paste centered
            out = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
            offset = ((canvas_w - resize_w) // 2, (canvas_h - resize_h) // 2)
            out.paste(resized, offset, resized)
        elif args.fit == "crop":
            left = (resize_w - canvas_w) // 2
            top = (resize_h - canvas_h) // 2
            out = resized.crop((left, top, left + canvas_w, top + canvas_h))
        else:
            out = resized

        dst_path.parent.mkdir(parents=True, exist_ok=True)

        # Save options for quality:
        #   optimize=True  -> smaller files, slower save
        #   compress_level -> 0 (none) to 9 (max). 9 is lossless, just slower.
        save_kwargs = {
            "format": "PNG",
            "optimize": args.optimize,
            "compress_level": args.compress_level,
        }
        out.save(dst_path, **save_kwargs)
        return f"{orig_w}x{orig_h} -> {canvas_w}x{canvas_h}"


def main():
    p = argparse.ArgumentParser(
        description="Resize transparent PNGs in a directory.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    p.add_argument("--input-dir", default="leftovers", help="Source directory.")
    p.add_argument(
        "--output-dir",
        default="leftovers_resized",
        help="Destination directory. Use the same as input-dir with --in-place to overwrite.",
    )
    p.add_argument("--in-place", action="store_true", help="Overwrite originals (be careful).")
    p.add_argument("--width", type=int, help="Target width in pixels.")
    p.add_argument("--height", type=int, help="Target height in pixels.")
    p.add_argument(
        "--max-side",
        type=int,
        help="Fit image inside a box of this size (longest side). Overrides width/height.",
    )
    p.add_argument(
        "--fit",
        choices=["pad", "crop", "stretch"],
        default="pad",
        help="How to fit when both width and height are given. "
        "pad = letterbox with transparency, crop = center-crop, stretch = distort.",
    )
    p.add_argument(
        "--resample",
        choices=list(RESAMPLE_FILTERS.keys()),
        default="lanczos",
        help="Resampling filter. LANCZOS is best for photo-like downscaling. "
        "Use 'nearest' for pixel art.",
    )
    p.add_argument(
        "--compress-level",
        type=int,
        default=9,
        choices=range(0, 10),
        metavar="[0-9]",
        help="PNG compression level. 9 = smallest file, still lossless.",
    )
    p.add_argument(
        "--optimize",
        action="store_true",
        default=True,
        help="Run PNG optimizer pass on save.",
    )
    p.add_argument("--no-optimize", dest="optimize", action="store_false")
    p.add_argument(
        "--recursive", action="store_true", help="Process subdirectories too."
    )
    p.add_argument(
        "--force", action="store_true", help="Re-save even if size already matches."
    )
    args = p.parse_args()

    if args.width is None and args.height is None and args.max_side is None:
        p.error("Specify at least one of --width, --height, or --max-side.")

    input_dir = Path(args.input_dir)
    if not input_dir.is_dir():
        print(f"Error: input directory '{input_dir}' not found.", file=sys.stderr)
        sys.exit(1)

    output_dir = input_dir if args.in_place else Path(args.output_dir)

    pattern = "**/*.png" if args.recursive else "*.png"
    pngs = sorted(input_dir.glob(pattern))
    if not pngs:
        print(f"No PNG files found in '{input_dir}'.")
        return

    resample = RESAMPLE_FILTERS[args.resample]
    print(f"Found {len(pngs)} PNG(s). Output -> {output_dir}")

    ok = fail = 0
    for src in pngs:
        rel = src.relative_to(input_dir)
        dst = output_dir / rel
        try:
            result = resize_image(src, dst, args, resample)
            print(f"  {rel}: {result}")
            ok += 1
        except Exception as e:
            print(f"  {rel}: FAILED ({e})", file=sys.stderr)
            fail += 1

    print(f"\nDone. {ok} succeeded, {fail} failed.")


if __name__ == "__main__":
    main()