import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

interface IncidentRecord {
  id: string;
  type: string;
  location: string;
  severity: string;
  startTime: string;
  description: string;
  affectedEntities: string[];
  status: string;
  source: string;
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchIncidents() {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        const apiKey = import.meta.env.VITE_API_KEY;
        const apiModel = import.meta.env.VITE_API_MODEL;

        if (!apiUrl || !apiKey || !apiModel) {
          console.error('Missing API configuration. Please check your .env file.');
          setIncidents([]);
          setLoading(false);
          return;
        }

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: apiModel,
            messages: [
              {
                role: "system",
                content: "Act as a Supply Chain Risk Analyst and generate a JSON array of 5 realistic logistics/transportation disruptions (e.g., strikes, port closures) causing outrage; return strictly valid JSON with fields: id, type, location, severity, startTime, description, affectedEntities, status output ONLY the JSON.."
              }
            ]
          })
        });
        const data = await response.json();
        let incidents: IncidentRecord[] = [];
        try {
          // Try to parse the LLM's response as JSON (handle string or object)
          let content = data.choices?.[0]?.message?.content;
          if (typeof content === 'string') {
            // Remove code block markers if present
            content = content.replace(/^```json|```$/g, '').trim();
            incidents = JSON.parse(content);
          } else {
            incidents = [];
          }
        } catch {
          incidents = [];
        }
        setIncidents(incidents);
      } catch (e) {
        setIncidents([]);
      }
      setLoading(false);
    }
    fetchIncidents();
  }, []);

  return (
    <MainLayout>
      <motion.div 
        className="p-6 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2 
          className="text-xl font-semibold text-foreground mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Incident Detection & Ingestion
        </motion.h2>
        <motion.div 
          className="overflow-x-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {loading ? (
            <motion.div 
              className="text-center text-muted-foreground py-8"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading incidents from LLM...
            </motion.div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Status</TableHead>
                
                  <TableHead>Affected Entities</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">No incidents found.</TableCell>
                  </TableRow>
                ) : (
                  incidents.map((inc, idx) => (
                    <motion.tr 
                      key={inc.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      className="border-b border-border hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">{inc.type}</TableCell>
                      <TableCell>{inc.location}</TableCell>
                      <TableCell>{inc.severity}</TableCell>
                      <TableCell>{new Date(inc.startTime).toLocaleString()}</TableCell>
                      <TableCell>{inc.status}</TableCell>
                     
                      <TableCell>{inc.affectedEntities.join(', ')}</TableCell>
                      <TableCell>{inc.description}</TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}
