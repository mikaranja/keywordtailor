"use client";

import {useState} from 'react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {generateLongTailKeywords} from "@/ai/flows/generate-long-tail-keywords";
import {Copy, Loader2} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {Textarea} from "@/components/ui/textarea";
import {useToast} from "@/hooks/use-toast";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {generateBlogPost} from "@/ai/flows/generate-blog-post";

export default function Home() {
  const [baseKeyword, setBaseKeyword] = useState('');
  const [longTailKeywords, setLongTailKeywords] = useState<string[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [blogPost, setBlogPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();

  const handleGenerateKeywords = async () => {
    setIsLoading(true);
    try {
      const result = await generateLongTailKeywords({baseKeyword});
      setLongTailKeywords(result.longTailKeywords);
    } catch (error: any) {
      toast({
        title: "Error generating keywords",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(longTailKeywords.join('\n'));
    toast({
      title: "Keywords copied to clipboard!",
    });
  };

  const handleGenerateBlogPost = async () => {
    if (!selectedKeyword) {
      toast({
        title: "Please select a keyword first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateBlogPost({keyword: selectedKeyword});
      setBlogPost(result.blogPost);
      // Implement the logic to generate and upload the blog post to WordPress
      // This is a placeholder for the actual implementation
      toast({
        title: "Blog post generated!",
        description: "The blog post has been generated.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error generating and uploading blog post",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-12 bg-secondary">
      <Card className="w-full max-w-2xl p-4 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary">Keyword Tailor</CardTitle>
          <CardDescription>Enter a base keyword to generate long-tail keyword suggestions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="baseKeyword" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Base Keyword
            </label>
            <Input
              id="baseKeyword"
              placeholder="Enter base keyword"
              value={baseKeyword}
              onChange={(e) => setBaseKeyword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button onClick={handleGenerateKeywords} disabled={isLoading}>
            {isLoading ? (
              <>
                Generating... <Loader2 className="ml-2 h-4 w-4 animate-spin"/>
              </>
            ) : (
              "Generate Keywords"
            )}
          </Button>

          {longTailKeywords.length > 0 && (
            <div className="mt-6">
              <Separator className="my-4"/>
              <h2 className="text-xl font-semibold text-primary mb-2">Generated Keywords</h2>
              <Textarea
                readOnly
                value={longTailKeywords.join('\n')}
                className="min-h-[100px] rounded-md shadow-sm resize-none"
              />

              <Button variant="secondary" className="mt-4" onClick={handleCopyToClipboard}>
                <Copy className="mr-2 h-4 w-4"/>
                Copy to Clipboard
              </Button>

              <div className="mt-4">
                <Select onValueChange={setSelectedKeyword}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select a keyword"/>
                  </SelectTrigger>
                  <SelectContent>
                    {longTailKeywords.map((keyword) => (
                      <SelectItem key={keyword} value={keyword}>
                        {keyword}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button className="mt-4" onClick={handleGenerateBlogPost} disabled={isLoading || !selectedKeyword}>
                {isLoading ? (
                  <>
                    Generating Blog Post... <Loader2 className="ml-2 h-4 w-4 animate-spin"/>
                  </>
                ) : (
                  "Generate &amp; Upload Blog Post to WordPress"
                )}
              </Button>
            </div>
          )}
          {blogPost.length > 0 && (
            <div className="mt-6">
              <Separator className="my-4"/>
              <h2 className="text-xl font-semibold text-primary mb-2">Generated Blog Post</h2>
              <Textarea
                readOnly
                value={blogPost}
                className="min-h-[200px] rounded-md shadow-sm resize-none"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
