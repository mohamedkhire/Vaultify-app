import React, { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toPng, toJpeg, toSvg } from 'html-to-image'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Download, Eye, EyeOff, Check } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PasswordBannerGeneratorProps {
  passwordName: string
  passwordValue: string
}

const interFontUrl = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2';

export function PasswordBannerGenerator({ passwordName, passwordValue }: PasswordBannerGeneratorProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg' | 'svg' | 'csv' | 'txt'>('png')
  const bannerRef = useRef<HTMLDivElement>(null)
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [fontFace, setFontFace] = useState<FontFace | null>(null)

  useEffect(() => {
    const loadFont = async () => {
      try {
        const font = new FontFace('Inter', `url(${interFontUrl})`, {
          style: 'normal',
          weight: '400',
          display: 'swap',
        });
        await font.load();
        document.fonts.add(font);
        setFontFace(font);
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading font:', error);
        // toast({ description: 'Error loading font. Using system font instead.', variant: 'destructive' });
        setFontsLoaded(true); // Proceed with system font
      }
    };
    loadFont();
  }, []);

  const generateImage = async () => {
    if (bannerRef.current && fontsLoaded) {
      try {
        // Ensure the font is loaded before generating the image
        if (fontFace) {
          await document.fonts.ready;
          await fontFace.load();
        }

        let dataUrl: string;
        const options = {
          quality: 0.95,
          fontEmbedCSS: fontFace ? `@font-face { font-family: 'Inter'; src: url(${interFontUrl}) format('woff2'); }` : '',
        };

        switch (exportFormat) {
          case 'jpeg':
            dataUrl = await toJpeg(bannerRef.current, options);
            break;
          case 'svg':
            dataUrl = await toSvg(bannerRef.current, options);
            break;
          case 'png':
            dataUrl = await toPng(bannerRef.current, options);
            break;
          case 'csv':
            dataUrl = `data:text/csv;charset=utf-8,Password Name,Password\n"${passwordName}","${passwordValue}"`;
            break;
          case 'txt':
            dataUrl = `data:text/plain;charset=utf-8,Password Name: ${passwordName}\nPassword: ${passwordValue}`;
            break;
        }
        const link = document.createElement('a');
        link.download = `${passwordName}-password.${exportFormat}`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // toast({ description: `${exportFormat.toUpperCase()} exported successfully!`, variant: 'success' });
      } catch (err) {
        console.error('Error generating file:', err);
        // toast({ description: 'Error exporting file. Please try again.', variant: 'destructive' });
      }
    } else {
      // toast({ description: 'Error: Banner not ready for export. Please try again.', variant: 'destructive' });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(passwordValue)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    // toast({ description: 'Password copied to clipboard!', variant: 'success' });
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-4">
        <motion.div 
          ref={bannerRef} 
          className="w-full h-[200px] bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-4 text-white shadow-lg"
          style={{ 
            fontFamily: fontsLoaded ? "'Inter', sans-serif" : 'sans-serif',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8" />
            <h2 className="text-xl font-bold">Vaultify</h2>
          </div>
          <h3 className="text-lg font-semibold mb-2">{passwordName}</h3>
          <p className="font-mono text-sm break-all bg-black/20 p-2 rounded">
            {showPassword ? passwordValue : '•'.repeat(passwordValue.length)}
          </p>
        </motion.div>
        <div className="flex justify-between">
          <Button onClick={() => setShowPassword(!showPassword)} variant="outline">
            {showPassword ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {showPassword ? 'Hide' : 'Show'} Password
          </Button>
          <Button onClick={copyToClipboard} variant="outline">
            {copied ? <Check className="mr-2 h-4 w-4" /> : 'Copy Password'}
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={exportFormat} onValueChange={(value: 'png' | 'jpeg' | 'svg' | 'csv' | 'txt') => setExportFormat(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG Image</SelectItem>
              <SelectItem value="jpeg">JPEG Image</SelectItem>
              <SelectItem value="svg">SVG Image</SelectItem>
              <SelectItem value="csv">CSV File</SelectItem>
              <SelectItem value="txt">Text File</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateImage} className="flex-1">
            <Download className="w-4 h-4 mr-2" /> Export as {exportFormat.toUpperCase()}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

